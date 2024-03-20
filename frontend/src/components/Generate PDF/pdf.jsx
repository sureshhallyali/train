import React, { useState } from 'react';

const DownloadPDF = () => {
  const [downloading, setDownloading] = useState(false); 

  const handleDownload = async () => {
    if (!downloading) {
      try {
        setDownloading(true); 
        const response = await fetch('http://localhost:3000/generate-pdf');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample.pdf'; 
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setDownloading(false); 
        alert('PDF generated successfully');
      } catch (error) {
        console.error('Error generating PDF:', error);
        setDownloading(false); 
        alert('Failed to generate PDF');
      }
    }
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={downloading}>
        {downloading ? 'Downloading...' : 'Download PDF'}
      </button>
    </div>
  );
};

export default DownloadPDF;
