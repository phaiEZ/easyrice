// app/layout.tsx or app/layout.js

import { ConfigProvider } from "antd";
import Navbar from "./components/navbar";
import "./globals.css";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
  keywords: "next.js, react, javascript, web development",
  author: "phai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
      </head>
      <body>
        <Navbar />

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00b96b',
            },
          }}
        >
          <div className="m-24 mt-8 ">{children}</div></ConfigProvider>
      </body>
    </html>
  );
}
