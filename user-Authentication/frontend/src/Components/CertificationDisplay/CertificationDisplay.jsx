import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Adjust to backend URL

const CertificationDisplay = () => {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/serviceProvider/auth/certifications`,
                    {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setCertifications(response.data.certifications);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching certifications:', error);
                setLoading(false);
            }
        };
        fetchCertifications();
    }, []);

    const getFileIcon = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        switch(extension) {
            case 'pdf':
                return '📄 PDF';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return '🖼️ Image';
            case 'doc':
            case 'docx':
                return '📝 Document';
            default:
                return '📁 File';
        }
    };

    if (loading) return <div>Loading certifications...</div>;

    return (
        <div className="certification-container">
            <h3>My Certifications</h3>
            {certifications.length === 0 ? (
                <p>No certifications uploaded yet</p>
            ) : (
                <ul className="certification-list">
                    {certifications.map((certUrl, index) => (
                        <li key={index} className="certification-item">
                            <span className="file-type">{getFileIcon(certUrl)}</span>
                            <a 
  href={`http://localhost:4000${certUrl}`} // use full path to backend
  target="_blank" 
  rel="noopener noreferrer"
  className="file-link"
>
  View Certification
</a>

                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CertificationDisplay;