"use client";

import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Table, message } from "antd";
import { useRouter } from "next/navigation";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import axios from "axios";

interface StandardDataType {
  key: string;
  minLength: number;
  maxLength: number;
  shape: string[];
  name: string;
  conditionMin: string;
  conditionMax: string;
}

interface Inspection {
  id: number;
  inspection_id: string;
  name: string;
  create_date: string;
  standard_id: string;
  note: string;
  standard_name: string;
  sampling_date: string;
  sampling_point: string[];
  price: string;
  image_link: string;
  standardData?: StandardDataType[];
}

const columns = [
  {
    title: "Create Date - Time",
    dataIndex: "create_date",
    key: "create_date",
    render: (text: string) => {
      const date = new Date(text);
      return <span>{date.toLocaleString("en-GB", { hour12: false })}</span>;
    },
  },
  {
    title: "Inspection ID",
    dataIndex: "inspection_id",
    key: "inspection_id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Standard Name",
    dataIndex: "standard_name",
    key: "standard_name",
  },
];

const App: React.FC = () => {
  const [searchForm] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState<Inspection[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/history");
        setData(response.data.data);
      } catch (error) {
        message.error("Error fetching data.");
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleDelete = async () => {
    try {
      if (selectedRowKeys.length === 0) {
        return;
      }

      const response = await axios.delete("http://localhost:5000/history", {
        data: { inspectionID: selectedRowKeys },
      });

      if (response.status === 200) {
        setData(
          data.filter((item) => !selectedRowKeys.includes(item.inspection_id))
        );
        setSelectedRowKeys([]);
        message.success("Successfully deleted selected records.");
      } else {
        message.error("Failed to delete selected records.");
      }
    } catch (error) {
      message.error("Error deleting records.");
    }
  };

  const handleSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      const params = new URLSearchParams();

      if (values.id) params.append("inspectionID", values.id);
      if (values.fromDate)
        params.append("fromDate", values.fromDate.format("YYYY-MM-DD"));
      if (values.toDate)
        params.append("toDate", values.toDate.format("YYYY-MM-DD"));

      const queryParams = `?${params.toString()}`;

      const response = await axios.get(
        `http://localhost:5000/history${queryParams}`
      );
      setData(response.data.data); // Assume the data is returned inside 'data' property
    } catch (error) {
      message.error("Search failed.");
    }
  };

  const handleClearFilters = async () => {
    try {
      await searchForm.resetFields();
      const response = await axios.get("http://localhost:5000/history");
      setData(response.data.data);
    } catch (error) {
      message.error("Error resetting filters.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          className="bg-[#1f7b44] text-white"
          onClick={() => router.push("/create-inspection")}>
          <FiPlus />
          Create Inspection
        </Button>
      </div>

      <div className="pt-4 px-8 rounded-xl bg-white shadow-md">
        <Form layout="vertical" form={searchForm}>
          <div className="flex gap-4">
            <Form.Item label="ID" name="id" className="w-full">
              <Input placeholder="Search with ID" />
            </Form.Item>
            <Form.Item label="From Date" name="fromDate" className="w-full">
              <DatePicker
                className="w-full"
                placeholder="Select From Date"
                format="DD/MM/YYYY"
              />
            </Form.Item>
            <Form.Item label="To Date" name="toDate" className="w-full">
              <DatePicker
                className="w-full"
                placeholder="Select To Date"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item>
              <Button type="link" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                className="bg-[#1f7b44]"
                onClick={handleSearch}>
                <FiSearch /> Search
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      <div>
        <Button
          className="bg-red-500 text-white"
          disabled={selectedRowKeys.length === 0}
          onClick={handleDelete}>
          <FiTrash2 /> Delete
        </Button>
      </div>

      <Table<Inspection>
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.inspection_id}
        rowSelection={{
          selectedRowKeys,
          onChange: handleSelectChange,
        }}
        onRow={(record) => ({
          onClick: () => router.push(`/history/${record.inspection_id}`),
        })}
        className="custom-table shadow-md"
      />
    </div>
  );
};

export default App;
