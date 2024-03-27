//home.jsx
import React, { useState } from "react";
import Navbar from "./navbar";
import EmailForm from "../Email send with attached/email";
import ImageComponent from "../Image downloader/image";
import "./Home.css"; // Import home CSS file

const Home = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showImageDownloader, setShowImageDownloader] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
  };

  const toggleImageDownloader = () => {
    setShowImageDownloader(!showImageDownloader);
  };
  const toggleGenerate = () => {
    setShowGenerate(!showGenerate);
  };

  return (
    <>
      <Navbar />
      <section className="hero-section">
        <p>Subscribe to </p>
        <h1>ADIS TECHNOLOGY Home Page</h1>
        <button onClick={toggleEmailForm}>Open Email Form</button>
        {showEmailForm && <EmailForm />}
        <div>
          <br />
        </div>

        <button onClick={toggleImageDownloader}>Open Image Downloader</button>
        {showImageDownloader && <ImageComponent />} 

        <div>
          <br />
        </div>

      </section>
    </>
  );
};
export default Home;
