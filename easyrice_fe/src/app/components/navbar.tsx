// src/app/components/Navbar.tsx

'use client';

import React from 'react';
import { Menu, ConfigProvider } from 'antd';
import { HomeOutlined, InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#707070] shadow-md">
            <div className="container p-4 px-16 flex ">
                <div className="text-xl font-bold ">
                    <Link href="/">EASYRICE TEST</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
