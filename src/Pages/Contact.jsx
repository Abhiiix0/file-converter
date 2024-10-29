// src/Components/Contact.js
import React, { useState } from "react";
import { MailOutlined } from "@ant-design/icons";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-100">
      <h2 className="text-4xl font-bold text-black mb-6">Contact Us</h2>
      <p className="text-lg text-black mb-4 text-center max-w-xl">
        We would love to hear from you! Please fill out the form below, and we
        will get back to you as soon as possible.
      </p>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-black"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-semibold mb-4 text-black">
          Contact Information
        </h3>
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center">
            <MailOutlined className="text-blue-500 text-2xl mr-2" />
            <span className="text-black">info@fileconverter.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
