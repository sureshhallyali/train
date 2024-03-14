import React, { useState } from 'react';
import './email.css';

const EmailForm = () => {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        subject: '',
        text: '',
        file: null
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append('from', formData.from);
        formDataToSend.append('to', formData.to);
        formDataToSend.append('subject', formData.subject);
        formDataToSend.append('text', formData.text);
        formDataToSend.append('file', formData.file);

        try {
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            alert('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Email Form</h2>
            <form className="email-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="from">From:</label>
                    <input type="email" id="from" name="from" value={formData.from} onChange={handleChange} required />
                </div>
    
                <div className="form-group">
                    <label htmlFor="to">To:</label>
                    <input type="email" id="to" name="to" value={formData.to} onChange={handleChange} required />
                </div>
    
                <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>
    
                <div className="form-group">
                    <label htmlFor="text">Text:</label>
                    <textarea id="text" name="text" rows="4" cols="50" value={formData.text} onChange={handleChange} required></textarea>
                </div>
    
                <div className="form-group">
                    <label htmlFor="file">Attachment:</label>
                    <input type="file" id="file" name="file" onChange={handleFileChange} />
                </div>
    
                <div className="form-group">
                    <input type="submit" value="Send Email" />
                </div>
            </form>
        </div>
    );
};

export default EmailForm;
