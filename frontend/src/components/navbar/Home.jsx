// Home.jsx
import React, { useState } from "react";
import Navbar from "./navbar";
import EmailForm from "../Email send with attached/email";
import ImageComponent from "../Image downloader/image";
import "./Home.css";
import ViewAndDownloadPDF from "../Generate PDF/pdf"

const Home = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showImageDownloader, setShowImageDownloader] = useState(false);
  // const [showGenerate, setShowGenerate] = useState(false);

  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
  };

  const toggleImageDownloader = () => {
    setShowImageDownloader(!showImageDownloader);
  };

  // const toggleGenerate = () => {
  //   setShowGenerate(!showGenerate);
  // };

  // const downloadPDF = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/generate-pdf', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/pdf',
  //       },
  //     });
      
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(new Blob([blob]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'sample.pdf');
  //     document.body.appendChild(link);
  //     link.click();
  //     link.parentNode.removeChild(link);
  //   } catch (error) {
  //     console.error('Error downloading PDF:', error);
  //   }
  // };

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

        <ViewAndDownloadPDF/>{/* Add ViewAndDownload component here*/}

      </section>
    </>
  );
};

export default Home;
