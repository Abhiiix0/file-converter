import React, { useState } from "react";
import EasyConerter from "../assets/EasyConerter.png";
const Header = () => {
  const [navSelect, setnavSelect] = useState("");
  return (
    <div className=" h-16 w-full bg-white border-b">
      <div className=" flex items-center h-full justify-between px-4">
        <img src={EasyConerter} className=" bg-blend-darken h-8" alt="" />
        <div className=" flex gap-4">
          <p
            onClick={() => setnavSelect("PDF")}
            className={` cursor-pointer ${
              navSelect === "PDF" && "text-blue-500"
            }  hover:text-blue-500 font-bold text-lg tracking-wider`}
          >
            PDF
          </p>
          <p
            onClick={() => setnavSelect("IMAGE")}
            className={` cursor-pointer ${
              navSelect === "IMAGE" && "text-blue-500"
            }  hover:text-blue-500 font-bold text-lg tracking-wider`}
          >
            IMAGE
          </p>
          <p
            onClick={() => setnavSelect("VIDEO")}
            className={` cursor-pointer ${
              navSelect === "VIDEO" && "text-blue-500"
            }  hover:text-blue-500 font-bold text-lg tracking-wider`}
          >
            VIDEO
          </p>
        </div>
        <div className=" flex gap-4">
          <p className=" cursor-pointer hover:text-blue-500 font-bold text-lg tracking-wider">
            About
          </p>
          <p className=" cursor-pointer hover:text-blue-500 font-bold text-lg tracking-wider">
            Contact
          </p>
        </div>
      </div>
      <div
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
      </div>
    </div>
  );
};

export default Header;
