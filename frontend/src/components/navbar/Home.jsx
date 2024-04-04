// Home.jsx
import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import EmailForm from "../Email send with attached/email";
import ImageComponent from "../Image downloader/image";
import "./Home.css";

const Home = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showImageDownloader, setShowImageDownloader] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [carInfoColumns, setCarInfoColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState({});

  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
  };

  const toggleImageDownloader = () => {
    setShowImageDownloader(!showImageDownloader);
  };

  const toggleGenerate = () => {
    setShowGenerate(!showGenerate);
  };

  //Download PDF file
  const downloadPDF = async () => {
    try {
      const response = await fetch("http://localhost:3000/generate-pdf", {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  //Download Excel file
  const downloadExcel = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/generate-excel-CarModel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedColumn),
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  // const getCarInfoColumns = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/getCarInfoColumns");
  //     const data = await response.json();
  //     setCarInfoColumns(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const column = ["Brand", "Model", "Year"];

  useEffect(() => {
    setCarInfoColumns(column);
  }, []);

  const toggle = (e) => {
    const columnName = e.target.name;
    const isChecked = e.target.checked;

    setSelectedColumn((previousSelectedColumn) => {
      if (isChecked) {
        return { ...previousSelectedColumn, [columnName]: e.target.value };
      } else {
        const { [columnName]: deletedKey, ...remainingColumns } =
          previousSelectedColumn;
        return remainingColumns;
      }
    });
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
        <button onClick={downloadPDF}>Download PDF</button>
        {/* button for PDF download */}
        <div>
          <br />
        </div>
        <button onClick={downloadExcel}>Download Excel</button>

        <div class="dropdown mt-5 btn">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Dropdown button
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            {carInfoColumns.map((column, index) =>
              column === "ID" ? null : (
                <li key={index}>
                  <input
                    type="checkbox"
                    name={column}
                    value={column}
                    onChange={toggle}
                    checked={Object.keys(selectedColumn).includes(column)}
                  />
                  {column}
                </li>
              )
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Home;