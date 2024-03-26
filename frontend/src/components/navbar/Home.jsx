import React, { useState } from "react";
import Navbar from "./navbar";
import EmailForm from "../Email send with attached/email";
import ImageComponent from "../Image downloader/image";
import GeneratePDF from "../Generate PDF/pdf"; // Corrected import name

const Home = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showImageDownloader, setShowImageDownloader] = useState(false); 
  const [showGenerate, setShowGenerate] = useState(false); // Corrected state name
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
        <view> 
          <br />
        </view>

        <button onClick={toggleImageDownloader}>Open Image Downloader</button>
        {showImageDownloader && <ImageComponent />} 
        <view>
          <br />
        </view>
        <button onClick={toggleGenerate}>Generate PDF</button>
        {showGenerate && <GeneratePDF />}
        <view>
          <br />
        </view>

      </section>
    </>
  );
};

export default Home;
