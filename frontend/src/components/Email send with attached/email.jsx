import React, { useState } from 'react';
import './email.css';

const EmailForm = () => {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        subject: '',
        text: '',
        files: [],
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            files: e.target.files,
        });
    };

    const generateAndSendPDF = async () => {
        try {
            const response = await fetch('http://localhost:3000/generate-pdf');
            const blob = await response.blob();
            const pdfFile = new File([blob], 'generated_pdf.pdf', {
                type: 'application/pdf',
            });
            setFormData({
                ...formData,
                files: [...formData.files, pdfFile],
            });
            alert('PDF generated and added as attachment successfully');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('from', formData.from);
        formDataToSend.append('to', formData.to.split(',').map((email) => email.trim()));
        formDataToSend.append('subject', formData.subject);
        formDataToSend.append('text', formData.text);

        for (let i = 0; i < formData.files.length; i++) {
            formDataToSend.append('files', formData.files[i]);
        }

        try {
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                body: formDataToSend,
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
                    <input type="text" id="to" name="to" value={formData.to} onChange={handleChange} required />
                    {/* Accepts comma-separated values */}
                    <small>Separate multiple email addresses with commas</small>
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
                    <label htmlFor="files">Attachments:</label>
                    <input type="file" id="files" name="files" multiple onChange={handleFileChange} />
                    {formData.files.length > 0 && (
                        <ul>
                            {Array.from(formData.files).map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="form-group">
                    <button type="button" onClick={generateAndSendPDF}>Generate PDF and Add as Attachment</button>
                </div>

          

                <div className="form-group">
                    <input type="submit" value="Send Email" />
                </div>

                
            </form>
        </div>
    );
};

export default EmailForm;
