import React, { useState } from "react";
import {
  MailOutlined,
  LinkedinOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { message } from "antd";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xyzywobj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (response.ok) {
        message.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        message.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("An error occurred. Please try again later.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-slate-100">
      <h2 className="text-2xl mt-6 sm:text-4xl font-bold text-black mb-4 sm:mb-6">
        Contact Us
      </h2>
      <p className="sm:text-lg text-black mb-4 sm:mb-9 text-center max-w-xl">
        We would love to hear from you! Please fill out the form below, and we
        will get back to you as soon as possible.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-5 sm:p-8 max-w-3xl mb-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="sm:flex gap-4">
            <div className="w-full">
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
            <div className="w-full">
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
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Contact Information Section */}
        <div className="flex flex-col items-center justify-center mt-5">
          <h3 className="text-lg font-semibold text-black mb-2">
            You can also reach me at:
          </h3>
          <div className="flex gap-6">
            <a
              href="https://www.linkedin.com/in/abhishek-nayak-6375ab128/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 text-2xl"
            >
              <LinkedinOutlined />
            </a>
            <a
              href="https://www.instagram.com/abhiiii.x0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 text-2xl"
            >
              <InstagramOutlined />
            </a>
            <a
              href="mailto:abhishek.nayak7766@gmail.com"
              className="text-red-600 hover:text-red-700 text-2xl"
            >
              <MailOutlined />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
