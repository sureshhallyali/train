import React, { useState } from 'react';

const ViewAndDownloadPDF = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleViewAndDownload= async () =>{
    if (!pdfUrl){
      try{
        setLoading(true);
        const response = await fetch("http://localhost:3000/generate-pdf");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url)
        setLoading(false);
      }catch(error){
        console.error('Error fetching PDF:', error);
        setLoading(false);
        alert('Failed to fetch PDF');
      }
    }
  };


const handleDownload = ()=>{
  const a = document.createElement('a');
  a.href = pdfUrl;
  a.download = 'sample.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

  return (
    <div style= {{width: '600px', height: '800px', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={handleViewAndDownload} disabled={loading || pdfUrl}>
        {loading ? 'loading...' : 'View PDF'} 
      </button>
      {pdfUrl && (
        <div style={{width: '100%', height: 'calc(100% - 50px)'}}> 
            <iframe src = {pdfUrl} 
            style={{width:'100%', height:'100%', border:'none'}} 
            title='PDF Viewer' 
            />
            </div>
      )}
    </div>
  )
};

export default ViewAndDownloadPDF;
