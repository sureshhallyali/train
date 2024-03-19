import React, { useState } from "react";
import Navbar from "./navbar";
import EmailForm from "../Email send with attached/email";
import ImageComponent from "../Image downloader/image";

const Home = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showImageDownloader, setShowImageDownloader] = useState(false); 
  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
  };

  const toggleImageDownloader = () => {
    setShowImageDownloader(!showImageDownloader);
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
        {showImageDownloader && <ImageComponent />} {/* Render ImageComponent when showImageDownloader is true */}
        <view>
          <br />
        </view>

      </section>
    </>
  );
};



const About = () => {
  return (
    <>
      <Navbar />
      <section className="hero-section">
        <p>Welcome to </p>
        <h1>ADIS TECHNOLOGY About Page</h1>
      </section>
    </>
  );
};

const Service = () => {
  return (
    <>
      <Navbar />
      <section className="hero-section">
        <p>Welcome to </p>
        <h1>ADIS TECHNOLOGY Service Page</h1>
      </section>
    </>
  );
};

const Contact = () => {
  return (
    <>
      <Navbar />
      <section className="hero-section">
        <p>Welcome to </p>
        <h1>ADIS TECHNOLOGY Contact Page</h1>
      </section>
    </>
  );
};

const App = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/about">
        <About />
      </Route>

      <Route path="/service">
        <Service />
      </Route>

      <Route path="/contact">
        <Contact />
      </Route>
    </Switch>
  );
};

export default Home;






