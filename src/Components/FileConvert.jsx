import React, { useState, useEffect } from "react";
import { Select, message, Upload } from "antd";
import { fetchFile } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import {
  DeleteOutlined,
  DownloadOutlined,
  FileImageOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Dragger } = Upload;

const FileConvert = () => {
  const imgOptions = [
    "jpg",
    "jpeg",
    "png",
    "bmp",
    "webp",
    "ico",
    "tif",
    "tiff",
    "svg",
    "raw",
    "tga",
  ];
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

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024)
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    if (sizeInBytes < 1024 * 1024 * 1024)
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleFileUpload = (info) => {
    const newFiles = info.fileList
      .map((item) => item.originFileObj)
      .filter(Boolean);
    const updatedFiles = newFiles.map((newFile) => {
      const fileExtension = newFile.name.split(".").pop().toLowerCase();

      return {
        file: newFile,
        filename: newFile.name,
        size: formatFileSize(newFile.size),
        downloadUrl: "",
        format: fileExtension,
      };
    });

    // Automatically detect file format and set it in the dropdown
    const initialFormats = {};
    updatedFiles.forEach((file) => {
      if (imgOptions.includes(file.format)) {
        initialFormats[file.filename] = file.format;
      }
    });

    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    setOutputFormat((prevFormat) => ({ ...prevFormat, ...initialFormats }));
  };

  const handleConvert = async (fileObj) => {
    if (!ffmpeg || !fileObj.file || !outputFormat[fileObj.filename]) return;

    setLoading((prevLoading) => ({ ...prevLoading, [fileObj.filename]: true }));
    // message.info("Converting...");

    try {
      await ffmpeg.writeFile(fileObj.filename, await fetchFile(fileObj.file));
      await ffmpeg.exec([
        "-i",
        fileObj.filename,
        `output.${outputFormat[fileObj.filename]}`,
      ]);
      const data = await ffmpeg.readFile(
        `output.${outputFormat[fileObj.filename]}`
      );

      const url = URL.createObjectURL(
        new Blob([data.buffer], {
          type: `image/${outputFormat[fileObj.filename]}`,
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
    <div
      className={`h-[calc(100vh-64px)] flex flex-col ${
        files?.length === 0 ? " justify-center" : " justify-start"
      } items-center bg-gradient-to-r bg-slate-50 p-3 md:p-6`}
    >
      <h1 className=" text-xl sm:text-4xl font-bold text-center text-gray-800 mb-4">
        <FileImageOutlined /> Image Converter
      </h1>
      <p className="text-center text-lg text-gray-600 ">
        Upload your images and convert them to desired formats!
      </p>

      {files.length === 0 ? (
        <Dragger
          beforeUpload={() => false}
          onChange={handleFileUpload}
          showUploadList={false}
          className="w-full sm:w-[650px] h-[220px] my-6"
        >
          <p className="ant-upload-text">Click or drag Image to upload</p>
          {/* <p className="ant-upload-hint">Max file size 1GB</p> */}
        </Dragger>
      ) : (
        <>
          <Upload
            beforeUpload={() => false}
            onChange={handleFileUpload}
            showUploadList={false}
          >
            <button className="bg-blue-500 text-white px-4 py-2 my-3 rounded">
              Add More Files
            </button>
          </Upload>
        </>
      )}
      <div className=" overflow-y-scroll md:px-2 w-full md:w-fit">
        {files.map((fileObj) => (
          <div
            key={fileObj.filename}
            className="bg-white shadow-sm border flex flex-col sm:flex-row sm:items-center justify-between rounded-md w-full md:w-[650px] h-fit pb-2 sm:pb-0 sm:h-[60px] px-2 mb-4"
          >
            <div>
              <p className="text-ellipsis  w-full md:w-[250px] text-[13px] md:text-[16px] text-wrap h-6 overflow-hidden m-0">
                {fileObj.filename}
              </p>
              <p className="m-0 mt-[-5px] mb-1 text-gray-400 text-[12px]">
                {fileObj.size}
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
                {imgOptions.map((format) => (
                  <Option key={format} value={format}>
                    {format}
                  </Option>
                ))}
              </Select>
              <button
                onClick={() => handleConvert(fileObj)}
                className="bg-blue-500 hover:bg-blue-600 h-8 px-2 text-white rounded-md"
              >
                {loading[fileObj.filename] ? (
                  <>
                    <LoadingOutlined /> Converting . . .
                  </>
                ) : (
                  "Convert"
                )}
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
    </div>
  );
};

export default FileConvert;
