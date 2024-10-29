import React, { useState, useEffect } from "react";
import { Select, message } from "antd";
import { fetchFile } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Upload } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const VideoConvert = () => {
  const videoOptions = ["mp4", "avi", "mov", "wmv", "mkv"];
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState({});
  const [loading, setLoading] = useState({});
  const [ffmpeg, setFfmpeg] = useState(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance);
    };
    loadFFmpeg();
  }, []);

  const handleFileUpload = (info) => {
    const newFile = info.fileList[info.fileList.length - 1].originFileObj;
    setFiles((prevFiles) => [
      ...prevFiles,
      {
        file: newFile,
        filename: newFile.name,
        downloadUrl: "",
      },
    ]);
  };

  const handleConvert = async (fileObj) => {
    if (!ffmpeg || !fileObj.file || !outputFormat[fileObj.filename]) return;

    setLoading((prevLoading) => ({ ...prevLoading, [fileObj.filename]: true }));
    message.info("Converting...");

    try {
      await ffmpeg.writeFile(fileObj.filename, await fetchFile(fileObj.file));

      // Change the resolution to 480p (854x480) in the conversion command
      await ffmpeg.exec([
        "-i",
        fileObj.filename,
        "-vf",
        "scale=854:480", // Specify the new resolution here
        `output.${outputFormat[fileObj.filename]}`,
      ]);

      const data = await ffmpeg.readFile(
        `output.${outputFormat[fileObj.filename]}`
      );

      const url = URL.createObjectURL(
        new Blob([data.buffer], {
          type: `video/${outputFormat[fileObj.filename]}`,
        })
      );

      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.filename === fileObj.filename
            ? { ...file, downloadUrl: url }
            : file
        )
      );
      message.success("Conversion successful!");
    } catch (error) {
      console.error("Conversion error:", error);
      message.error("Conversion failed. Please try again.");
    } finally {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [fileObj.filename]: false,
      }));
    }
  };

  const handleDelete = (filename) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.filename !== filename)
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col justify-center items-center bg-gradient-to-r bg-slate-50 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Video Converter
      </h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        Upload your videos and convert them to desired formats!
      </p>

      <Upload
        beforeUpload={() => false}
        onChange={handleFileUpload}
        accept="video/*"
        showUploadList={false}
      >
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Add Video File
        </button>
      </Upload>

      {files.map((fileObj) => (
        <div
          key={fileObj.filename}
          className="bg-white shadow-sm border flex items-center justify-between rounded-md w-[650px] h-[60px] px-2 mb-4"
        >
          <div>
            <p className="text-ellipsis w-[250px] text-wrap h-6 overflow-hidden m-0">
              {fileObj.filename}
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              value={outputFormat[fileObj.filename] || ""}
              onChange={(value) =>
                setOutputFormat((prevFormat) => ({
                  ...prevFormat,
                  [fileObj.filename]: value,
                }))
              }
              className="w-[80px]"
              placeholder="Format"
            >
              {videoOptions.map((format) => (
                <Option key={format} value={format}>
                  {format}
                </Option>
              ))}
            </Select>
            <button
              onClick={() => handleConvert(fileObj)}
              className="bg-blue-500 hover:bg-blue-600 h-8 px-2 text-white rounded-md"
              disabled={loading[fileObj.filename]}
            >
              {loading[fileObj.filename] ? <LoadingOutlined /> : "Convert"}
            </button>
            {fileObj.downloadUrl && (
              <a
                href={fileObj.downloadUrl}
                download={`converted_${fileObj.filename}.${
                  outputFormat[fileObj.filename]
                }`}
                className="bg-blue-500 hover:bg-blue-600 h-8 px-2 text-white rounded-md flex items-center"
              >
                <DownloadOutlined style={{ marginRight: "4px" }} /> Download
              </a>
            )}
            <button
              onClick={() => handleDelete(fileObj.filename)}
              className="bg-red-500 hover:bg-red-600 h-8 px-2 text-white rounded-md"
            >
              <DeleteOutlined />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoConvert;
