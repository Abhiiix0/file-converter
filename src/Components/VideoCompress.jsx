import React, { useState, useEffect } from "react";
import { message, Select, Upload } from "antd";
import { fetchFile } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import {
  CompressOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { Option } = Select;
const VideoCompress = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState({});
  const [ffmpeg, setFfmpeg] = useState(null);

  const resolutionOptions = [
    { label: "1080p (HD)", value: "1920x1080" },
    { label: "720p (HD)", value: "1280x720" },
    { label: "480p (SD)", value: "854x480" },
    { label: "360p (SD)", value: "640x360" },
    { label: "240p (SD)", value: "426x240" },
  ];

  const [outputResolution, setOutputResolution] = useState({});

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

  const handleFileUpload = async (info) => {
    const newFiles = info.fileList
      .map((item) => item.originFileObj)
      .filter(Boolean);

    const validFiles = [];

    for (const file of newFiles) {
      if (!file.type.startsWith("video/")) {
        message.error("Only video files are allowed!");
        continue;
      }

      if (file.size > 1024 * 1024 * 1024) {
        message.error("File size should not exceed 1GB!");
        continue;
      }

      const filename = file.name;
      const size = formatFileSize(file.size);
      const updatedFile = {
        file,
        filename,
        size,
        downloadUrl: "",
        progress: 0,
      };

      // Detect video resolution
      try {
        await ffmpeg.writeFile(filename, await fetchFile(file));
        const probeResult = await ffmpeg.exec(["-i", filename]);
        const resolutionMatch = probeResult.match(/(\d{3,4})x(\d{3,4})/);
        if (resolutionMatch) {
          const width = parseInt(resolutionMatch[1], 10);
          const height = parseInt(resolutionMatch[2], 10);
          const resolution = `${width}x${height}`;

          // Pre-select the closest resolution
          const closestOption = resolutionOptions.find(
            (option) => option.value === resolution
          )?.value;
          if (closestOption) {
            setOutputResolution((prev) => ({
              ...prev,
              [filename]: closestOption,
            }));
          }
        }
      } catch (error) {
        console.error("Error detecting video resolution:", error);
      }

      validFiles.push(updatedFile);
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleCompress = async (fileObj) => {
    if (!ffmpeg || !fileObj.file || !outputResolution[fileObj.filename]) return;

    setLoading((prevLoading) => ({ ...prevLoading, [fileObj.filename]: true }));
    // message.info("Compressing...");

    try {
      await ffmpeg.writeFile(fileObj.filename, await fetchFile(fileObj.file));
      const resolution = outputResolution[fileObj.filename];
      const outputFilename = `output_${fileObj.filename}`;

      await ffmpeg.exec([
        "-i",
        fileObj.filename,
        "-vf",
        `scale=${resolution}`,
        "-c:v",
        "libx264",
        "-crf",
        "23",
        "-preset",
        // "slow",
        "fast",
        outputFilename,
      ]);

      const data = await ffmpeg.readFile(outputFilename);
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.filename === fileObj.filename
            ? { ...file, downloadUrl: url }
            : file
        )
      );
      message.success("Compression successful!");
    } catch (error) {
      console.error("Compression error:", error);
      message.error("Compression failed. Please try again.");
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
    <div className="h-[calc(100vh-64px)] flex flex-col justify-start items-center bg-slate-50 p-3 md:p-6">
      <h1 className=" text-xl sm:text-4xl font-bold text-center text-gray-800 mb-4">
        <CompressOutlined /> Video Compressor
      </h1>
      <p className="text-center text-lg text-gray-600 ">
        Upload your Videos and compress them to desired resolutions!
      </p>

      {files.length === 0 ? (
        <Dragger
          beforeUpload={() => false}
          onChange={handleFileUpload}
          showUploadList={false}
          className="  w-full sm:w-[650px] h-[220px] my-6"
        >
          <p className="ant-upload-text">Click or drag Image to upload</p>
          <p className="ant-upload-hint">Max file size 1GB</p>
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
      <div className="overflow-y-scroll md:px-2 w-full md:w-fit">
        {files.map((fileObj) => (
          <div
            key={fileObj.filename}
            className="bg-white shadow-sm border flex flex-col sm:flex-row sm:items-center justify-between rounded-md w-full md:w-[650px] h-fit pb-2 sm:pb-0 sm:h-[60px] px-2 mb-4"
          >
            <div>
              <p className="text-ellipsis w-full md:w-[250px] text-[13px] md:text-[16px] text-wrap h-6 overflow-hidden m-0">
                {fileObj.filename}
              </p>
              <p className="m-0 mt-[-5px] mb-1 text-gray-400 text-[12px]">
                {fileObj.size}
              </p>
            </div>
            <div className="flex gap-2">
              <Select
                value={outputResolution[fileObj.filename] || ""}
                onChange={(value) =>
                  setOutputResolution((prev) => ({
                    ...prev,
                    [fileObj.filename]: value,
                  }))
                }
                className="w-[100px] sm:w-[120px] text-sm"
                placeholder="Resolution"
              >
                {resolutionOptions.map((option) => (
                  <Option
                    key={option.value}
                    className=" text-sm"
                    value={option.value}
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>
              <button
                onClick={() => handleCompress(fileObj)}
                className="bg-blue-500 hover:bg-blue-600 h-8 px-2 text-white rounded-md"
              >
                {loading[fileObj.filename] ? (
                  <>{fileObj.progress}% Compressing...</>
                ) : (
                  "Compress"
                )}
              </button>
              {!fileObj.downloadUrl && (
                <a
                  href={fileObj.downloadUrl}
                  download={`compressed_${fileObj.filename}`}
                  className="bg-blue-500 hover:bg-blue-600 h-8 px-2 text-white rounded-md flex items-center"
                >
                  <DownloadOutlined style={{ marginRight: "4px" }} />{" "}
                  <p className=" hidden sm:block">Download</p>
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

export default VideoCompress;
