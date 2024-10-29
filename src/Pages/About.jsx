// src/Components/About.js
import React from "react";
import {
  CheckCircleOutlined,
  SecurityScanOutlined,
  CompressOutlined,
  FileImageOutlined,
} from "@ant-design/icons";

const About = () => {
  const features = [
    {
      id: 1,
      title: "Safe and Secure",
      description:
        "Your files are processed on the client side, ensuring maximum privacy and security.",
      icon: <CheckCircleOutlined className="text-green-500 text-3xl mr-4" />,
    },
    {
      id: 2,
      title: "Video Compression",
      description:
        "Compress your videos effortlessly without compromising on quality.",
      icon: <CompressOutlined className="text-green-500 text-3xl mr-4" />,
    },
    {
      id: 3,
      title: "Client-Side Processing",
      description:
        "All conversions are performed in your browser, ensuring your files are never uploaded to our servers.",
      icon: <SecurityScanOutlined className="text-green-500 text-3xl mr-4" />,
    },
    {
      id: 1,
      title: "Wide Format Support",
      description:
        "Convert images, videos, and PDF files with ease using our intuitive interface.",
      icon: <FileImageOutlined className="text-green-500 text-3xl mr-4" />,
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-r bg-slate-100 from-transparent  p-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        About File Converter
      </h2>
      <p className="text-lg text-gray-700 mb-4 text-center max-w-xl">
        Welcome to our File Converter website! We provide a secure and efficient
        way to convert your files to various formats. Our service is designed to
        handle video, image, and PDF conversions while ensuring that your data
        remains safe and secure.
      </p>
      <div className=" flex flex-row items-center flex-wrap justify-center gap-6 w-full ">
        {features.map((feature) => (
          <div className="flex flex-col w-[300px] h-[180px] items-center p-4 bg-white shadow-md rounded-md">
            <div className=" w-full flex justify-between items-center">
              {feature?.icon}
              <h3 className="text-xl font-semibold">{feature?.title}</h3>
            </div>
            <div className=" h-full w-full grid place-content-center">
              <p className="text-gray-600 text-center">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* New Section for File Types */}
      <div className="mt-8 max-w-3xl text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Supported File Conversions
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>Image Files (e.g., JPG, PNG, GIF)</li>
          <li>Video Files (e.g., MP4, AVI, MOV)</li>
          <li>PDF Files</li>
        </ul>
        <p className="mt-4 text-lg text-gray-700">
          Convert your files easily and efficiently using our intuitive
          interface!
        </p>
      </div>
    </div>
  );
};

export default About;
