"use client";

import { Modal, Button, Form, Input, Checkbox, DatePicker } from 'antd';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

interface HistoryPageProps {
    params: Promise<{ slug: string }>;
}

interface InspectionHistory {
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
}


const Page: React.FC<HistoryPageProps> = ({ params }) => {
    const router = useRouter();
    const [slug, setSlug] = useState<string>("");
    const [res, setRes] = useState<InspectionHistory>();
    const [isModalVisible, setIsModalVisible] = useState(false);


    useEffect(() => {
        const getSlug = async () => {
            const { slug } = await params;
            setSlug(slug);
        };
        getSlug();
    }, [params]);


    useEffect(() => {
        if (slug) {
            const fetchInspectionData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/history/${slug}`);

                    setRes(response.data.data[0]);
                    console.log(response.data.data[0]);


                } catch (error) {
                    console.error("Error fetching inspection data:", error);
                }
            };

            fetchInspectionData();
        }
    }, [slug]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleBack = () => {
        router.back();
    };

    if (!res) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-16 mx-24">
            <Modal
                title={"Edit Inspection ID " + slug}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Form layout="vertical">

                    <Form.Item label="Note" name="note">
                        <Input placeholder="Inspection Support" />
                    </Form.Item>


                    <Form.Item label="Price" name="price">
                        <Input placeholder="15,000" />
                    </Form.Item>


                    <Form.Item label="Sampling Point" name="samplingPoint">
                        <Checkbox.Group style={{ display: 'flex', gap: '1rem' }}>
                            <Checkbox value="front-end">Front End</Checkbox>
                            <Checkbox value="back-end">Back End</Checkbox>
                            <Checkbox value="other">Other</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>


                    <Form.Item label="Date/Time of Sampling" name="dateTimeOfSampling">
                        <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>

                    <div className="flex justify-end gap-4">
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit" onClick={handleOk}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal>
            <div className="text-4xl font-bold text-center">Inspection</div>
            <div className="flex flex-row gap-8 justify-center">
                <div className="w-1/3 flex flex-col gap-4">
                    <img
                        src={res.image_link}
                        alt="Inspection"
                        className="w-full h-[540px] object-cover rounded shadow-md"
                    />
                    <div className="flex justify-end gap-4">
                        <Button onClick={handleBack}>Back</Button> <Button type="primary" onClick={showModal}>Edit</Button>
                    </div>
                </div>
                <div className="w-full">
                    <div className=" flex flex-col w-full shadow-md rounded-md bg-gray-50 p-4  gap-4">
                        <div className="grid grid-cols-2 p-4 bg-white rounded-xl gap-4">
                            <div>
                                <div className="text-[#707070]">Create Date - Time</div>
                                <div>{new Date(res.create_date).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-[#707070]">Inspection ID:</div>
                                <div>{res.inspection_id}</div>
                            </div>
                            <div>
                                <div className="text-[#707070]">Standard: </div>
                                <div>{res.standard_name}</div>
                            </div>
                            <div>
                                <div className="text-[#707070]">Total Sample:</div>
                                <div>{res.sampling_point.join(",")}</div>
                            </div>
                            <div>
                                <div className="text-[#707070]">Update Date - Time:</div>
                                <div>{new Date(res.create_date).toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 p-4 bg-white rounded-xl gap-4">
                            <div>
                                <div className="text-[#707070]">Note</div>
                                <div>{res.note}</div>
                            </div>
                            <div>
                                <div className="text-[#707070]">Price</div>
                                <div>{res.price}</div>
                            </div>
                            <div>
                                <div className="text-[#707070]">Date/Time of Sampling</div>
                                <div>{new Date(res.sampling_date).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-[#707070]">Sampling Point</div>
                                <div>{res.sampling_point.join(",")}</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row font-bold bg-gray-200 p-2 rounded-md">
                                <div className="w-full">Name</div>
                                <div className="w-1/6">Length</div>
                                <div className="w-1/6">Actual</div>
                            </div>

                            <div className="flex flex-row p-2 border-b-[1px]">
                                <div className="w-full">ข้าวเต็มเมล็ด</div>
                                <div className="w-1/6">{">= 7"}</div>
                                <div className="w-1/6">{"0.00 %"}</div>
                            </div>
                            <div className="flex flex-row p-2 border-b-[1px]">
                                <div className="w-full">ข้าวเต็มเมล็ด</div>
                                <div className="w-1/6">{">= 7"}</div>
                                <div className="w-1/6">{"0.00 %"}</div>
                            </div>
                            <div className="flex flex-row p-2">
                                <div className="w-full">ข้าวเต็มเมล็ด</div>
                                <div className="w-1/6">{">= 7"}</div>
                                <div className="w-1/6">{"0.00 %"}</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row font-bold bg-gray-200 p-2 rounded-md">
                                <div className="w-full">Name</div>
                                <div className="w-1/6">Length</div>
                                <div className="w-1/6">Actual</div>
                            </div>

                            <div className="flex flex-row p-2 border-b-[1px]">
                                <div className="w-full">ข้าวเต็มเมล็ด</div>
                                <div className="w-1/6">{">= 7"}</div>
                                <div className="w-1/6">{"0.00 %"}</div>
                            </div>
                            <div className="flex flex-row p-2 border-b-[1px]">
                                <div className="w-full">ข้าวเต็มเมล็ด</div>
                                <div className="w-1/6">{">= 7"}</div>
                                <div className="w-1/6">{"0.00 %"}</div>
                            </div>
                            <div className="flex flex-row p-2">
                                <div className="w-full">ข้าวเต็มเมล็ด</div>
                                <div className="w-1/6">{">= 7"}</div>
                                <div className="w-1/6">{"0.00 %"}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
};

export default Page;
