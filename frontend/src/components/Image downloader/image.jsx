import React, { useState } from 'react';

const ImageDownloadForm = () => {
    const [imageUrl, setImageUrl] = useState('');

    const handleChange = (e) => {
        setImageUrl(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3000/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageUrl })
            });

            if (!response.ok) {
                throw new Error('Failed to download image');
            } 
            alert('Image downloaded successfully');
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Image Download Form</h2>
            <form className="image-download-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input type="text" id="imageUrl" name="imageUrl" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="submit" value="Download Image" />
                </div>
            </form>
        </div>
    );
};

export default ImageDownloadForm;
