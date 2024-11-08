import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import FileConvert from "./Components/FileConvert";
import VideoConvert from "./Components/VideoConvert";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import VideoCompress from "./Components/VideoCompress";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<FileConvert />} />
        <Route path="/video-convert" element={<VideoConvert />} />
        <Route path="/video-compress" element={<VideoCompress />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;
