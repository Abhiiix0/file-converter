import React from "react";
import { useState, useEffect } from "react";
import { Upload, Button, Select, message } from "antd";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import Dragger from "antd/es/upload/Dragger";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
const { Option } = Select;
const Converter = ({ files }) => {
  const imgOptions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "ico",
    "tif",
    "tiff",
    "svg",
    "raw",
    "tga",
  ];

  const [file, setFile] = useState(files);
  const [fileType, setFileType] = useState("image");
  const [outputFormat, setOutputFormat] = useState("");
  const [loading, setLoading] = useState(false);
  const [ffmpeg, setFfmpeg] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [filename, setfilename] = useState("");
  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
      const ffmpeg = new FFmpeg();
      //   await ffmpeg.load({
      //     coreURL: await toBlobURL(
      //       `${baseURL}/ffmpeg-core.js`,
      //       "text/javascript"
      //     ),
      //     wasmURL: await toBlobURL(
      //       `${baseURL}/ffmpeg-core.wasm`,
      //       "application/wasm"
      //     ),
      //     workerURL: await toBlobURL(
      //       `${baseURL}/ffmpeg-core.worker.js`,
      //       "text/javascript"
      //     ),
      //   });
      await ffmpeg.load();
      console.log(ffmpeg);
      setFfmpeg(ffmpeg);
    };

    loadFFmpeg();
    handleFileUpload(file);
  }, []);

  const [fileSizes, setfileSizes] = useState("");
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };
  const handleFileUpload = (info) => {
    if (info.fileList.length > 0) {
      console.log(info);
      setFile(info.fileList[0].originFileObj);
      setfileSizes(formatFileSize(info.fileList[0].originFileObj?.size));
      setfilename(info.fileList[0].originFileObj?.name);
      setPreviewUrl(URL.createObjectURL(info.fileList[0].originFileObj));
    }
  };
  const handleConvert = async () => {
    console.log("1");
    if (!ffmpeg || !file || !outputFormat) return;

    setLoading(true);
    message.info("Converting...");

    try {
      await ffmpeg.writeFile(file.name, await fetchFile(file));
      await ffmpeg.exec(["-i", file.name, `output.${outputFormat}`]);
      const data = await ffmpeg.readFile(`output.${outputFormat}`);

      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: `image/${outputFormat}` })
      );

      setDownloadUrl(url);
      setPreviewUrl(url); // Set the preview URL to display the converted file
      message.success("Conversion successful!");
    } catch (error) {
      console.error("Conversion error:", error);
      message.error("Conversion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white shadow-sm border flex items-center justify-between rounded-md w-[650px] h-[60px] px-2">
      <div>
        <p className=" text-ellipsis w-[250px] text-wrap h-6 overflow-hidden m-0">
          {filename}
        </p>
        <p className=" m-0 text-gray-400 text-[12px]">{fileSizes}</p>
      </div>
      <div className=" flex gap-2">
        <Select
          value={outputFormat}
          onChange={(value) => setOutputFormat(value)}
          className="w-[80px]"
          placeholder="Select Output Format"
          // disabled={!file}
        >
          {imgOptions?.map((data, index) => (
            <Option key={index} value={data}>
              {data}
            </Option>
          ))}
        </Select>
        <button
          onClick={() => handleConvert()}
          className=" bg-blue-500  hover:bg-blue-600 h-8 px-2 text-white  rounded-md "
        >
          {loading ? (
            <>
              {" "}
              <LoadingOutlined /> Convert . . .
            </>
          ) : (
            "Convert Now"
          )}
        </button>
        {downloadUrl && (
          <Button
            type="link"
            href={downloadUrl}
            download={`converted_file.${outputFormat}`}
            className=" bg-blue-500 border h-8 px-2 text-white font-medium rounded-md "
          >
            <DownloadOutlined width={10} /> download
          </Button>
        )}
      </div>
    </div>
  );
};

export default Converter;
