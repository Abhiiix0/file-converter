import React, { useState } from "react";
import EasyConerter from "../assets/EasyConerter.png";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Drawer, Dropdown } from "antd";
import { Link } from "react-router-dom";
const Header = () => {
  const [navSelect, setnavSelect] = useState("");
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const items = [
    {
      key: "1",
      label: (
        <Link
          to="video-convert"
          onClick={() => setnavSelect("VIDEO")}
          className={` cursor-pointer ${
            navSelect === "VIDEO" && "text-blue-500"
          }  hover:text-blue-500 tracking-wider`}
        >
          Video Format
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          to="video-compress"
          onClick={() => setnavSelect("VIDEO")}
          className={` cursor-pointer ${
            navSelect === "VIDEO" && "text-blue-500"
          }  hover:text-blue-500 tracking-wider`}
        >
          Video Compress
        </Link>
      ),
    },
  ];

  return (
    <div className=" h-16 w-full bg-white border-b">
      <div className=" flex items-center h-full justify-between px-4">
        <img src={EasyConerter} className=" bg-blend-darken h-8" alt="" />
        <div className=" hidden md:flex gap-4">
          {/* <Link
            to="/"
            onClick={() => setnavSelect("PDF")}
            className={` cursor-pointer ${
              navSelect === "PDF" && "text-blue-500"
            }  hover:text-blue-500 font-bold text-lg tracking-wider`}
          >
            PDF
          </Link> */}
          <Link
            to="/"
            // onClick={() => setnavSelect("IMAGE")}
            className={` cursor-pointer ${
              navSelect === "IMAGE" && "text-blue-500"
            }  hover:text-blue-500 font-bold text-lg h-[50px] grid place-content-center tracking-wider`}
          >
            IMAGE
          </Link>

          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
          >
            <p className="font-bold hover:text-blue-500 cursor-pointer h-[50px] grid place-content-center text-lg tracking-wider">
              VIDEO
            </p>
          </Dropdown>
        </div>
        <div className="  hidden md:flex   gap-4">
          <Link
            to="/about"
            className=" cursor-pointer hover:text-blue-500 font-bold text-lg tracking-wider"
          >
            About
          </Link>
          <Link
            to="/contact"
            className=" cursor-pointer hover:text-blue-500 font-bold text-lg tracking-wider"
          >
            Contact
          </Link>
        </div>
        <MenuUnfoldOutlined
          onClick={() => showDrawer()}
          className=" text-[25px] md:hidden"
        />
      </div>
      {/* <div
        className={` ${
          !navSelect && "hidden"
        } absolute left-0 right-0 flex justify-center top-11 `}
      >
        <div
          className={` ${
            navSelect === "VIDEO" && "ml-44"
          } flex items-center mt-2 flex-col ${navSelect === "PDF" && "mr-28"} ${
            navSelect === "IMAGE" && "ml-5"
          }`}
        >
          <div className="triangle bg-white w-6 h-6"></div>
          <div className=" w-[600px] h-[250px] bg-white rounded-md  shadow-md"></div>
        </div>
      </div> */}
      <Drawer className=" md:hidden" onClose={onClose} open={open}>
        <div className=" flex flex-col justify-between h-full">
          <div className=" flex flex-col ">
            <Link
              to="/"
              onClick={onClose}
              className=" font-medium text-lg  uppercase hover:bg-blue-400 py-2 hover:text-white rounded-md px-2"
            >
              Image
            </Link>
            <Link
              to="/video-convert"
              onClick={onClose}
              className=" font-medium text-lg  uppercase hover:bg-blue-400 py-2 hover:text-white rounded-md px-2"
            >
              Video Format
            </Link>
            <Link
              to="/video-compress"
              onClick={onClose}
              className=" font-medium text-lg  uppercase hover:bg-blue-400 py-2 hover:text-white rounded-md px-2"
            >
              Video Compress
            </Link>
          </div>
          <div className=" flex flex-col ">
            <Link
              to="/about"
              onClick={onClose}
              className=" font-medium text-lg  uppercase  py-2 px-2"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={onClose}
              className=" font-medium text-lg  uppercase  py-2 px-2"
            >
              Contact
            </Link>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
