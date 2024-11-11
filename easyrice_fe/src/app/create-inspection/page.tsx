"use client";

import {
    Button,
    Card,
    Checkbox,
    DatePicker,
    Form,
    Input,
    Select,
    Upload,
    message,
} from "antd";
import React, { useState } from "react";
import { RcFile } from "antd/es/upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import moment from "moment";

const App: React.FC = () => {
    const [createForm] = Form.useForm();
    const [fileName, setFileName] = useState<string>("");
    const router = useRouter();

    const handleFileUpload = (file: RcFile) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                setFileName(file.name);
            } catch {
                message.error("Invalid JSON file");
            }
        };
        reader.readAsText(file);
        return false;
    };

    const generateInspectionID = () => {
        return `INS-${Date.now()}`;
    };

    // Update the type of `values` to include `samplingTime` as a moment object
    const createPayload = (values: {
        name: string,
        imageLink: string,
        standard: string,
        note?: string,
        price?: number,
        samplingTime?: moment.Moment, // Properly type samplingTime as moment.Moment
        samplingPoint?: string[],
    }) => {
        return {
            name: values.name,
            createDate: new Date().toISOString(),
            imageLink: values.imageLink || "https://example.com/default.jpg",
            inspectionID: generateInspectionID(),
            standardID: values.standard,
            note: values.note || "",
            standardName: "Standard Name A",
            samplingDate: values.samplingTime ? values.samplingTime.format("YYYY-MM-DD HH:mm:ss") : "",
            samplingPoint: values.samplingPoint || [],
            price: values.price || 0,
            standardData: [
                {
                    key: "Key-001",
                    minLength: 10,
                    maxLength: 100,
                    shape: ["circle", "square"],
                    name: "Standard Data A",
                    conditionMin: "GE",
                    conditionMax: "LE",
                    value: 50,
                },
            ],
        };
    };

    const handleSubmit = () => {
        createForm
            .validateFields()
            .then((values) => {
                const payload = createPayload(values);

                axios
                    .post("http://localhost:5000/history", payload)
                    .then(() => {
                        message.success("Inspection created successfully!");
                        router.push("/"); // Navigate to home page after successful submission
                    })
                    .catch((error) => {
                        const errorMsg = error.response
                            ? error.response.data.message || "Internal Server Error"
                            : "No response from server";
                        message.error(`Error: ${errorMsg}`);
                    });
            })
            .catch((errorInfo) => {
                console.error("Validation Failed:", errorInfo);
            });
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="text-4xl font-bold text-center">Create Inspection</div>
            <Card className="w-[480px] mx-auto shadow-xl">
                <Form layout="vertical" form={createForm}>
                    <div className="flex flex-col w-full">
                        <Form.Item label="Name" name="name" required>
                            <Input placeholder="Enter Inspection Name" />
                        </Form.Item>

                        <Form.Item label="Image Link" name="imageLink" required>
                            <Input placeholder="Enter Image Link" />
                        </Form.Item>

                        <Form.Item label="Standard" name="standard" required>
                            <Select placeholder="Select Standard">
                                <Select.Option value="standard1">Standard 1</Select.Option>
                                <Select.Option value="standard2">Standard 2</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Upload File" name="upload-file" required>
                            <Upload beforeUpload={handleFileUpload} accept=".json" showUploadList={false}>
                                <Button className="w-full">Upload JSON File</Button>
                            </Upload>
                            {fileName && <div className="text-gray-500">Uploaded File: {fileName}</div>}
                        </Form.Item>

                        <Form.Item label="Note" name="note">
                            <Input placeholder="Enter any notes" />
                        </Form.Item>

                        <Form.Item label="Price" name="price">
                            <Input placeholder="Enter Price" />
                        </Form.Item>

                        <Form.Item label="Sampling Point" name="samplingPoint">
                            <Checkbox.Group className="flex justify-between" options={["Front End", "Back End", "Other"]} />
                        </Form.Item>

                        <Form.Item label="Date/Time of Sampling" name="samplingTime">
                            <DatePicker
                                className="w-full"
                                placeholder="Please select Date/Time"
                                format="DD/MM/YYYY HH:mm:ss"
                                showTime={{ format: "HH:mm:ss" }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" onClick={handleSubmit} className="w-full">
                                Submit
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default App;
