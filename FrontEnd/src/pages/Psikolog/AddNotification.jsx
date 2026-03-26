import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNotification } from '../../services/NotificationService';
import { getAllPatients } from '../../services/PacientiService';
import PsikologSidePanel from './PsikologSidePanel';
import '../../styles/auth.css';

function AddNotification() {
    const [formData, setFormData] = useState({
        patientId: '',
        title: '',
        message: ''
    });
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await getAllPatients();
            console.log('Patients from API:', response.data);
            setPatients(response.data || []);
        } catch (error) {
            toast.error('Gabim në ngarkim e pacientëve');
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.patientId) {
            toast.error('Zgjedh një pacient!');
            return;
        }
        if (!formData.title.trim()) {
            toast.error('Shto titull!');
            return;
        }
        if (!formData.message.trim()) {
            toast.error('Shto mesazh!');
            return;
        }

        try {
            setLoading(true);
            await createNotification({
                PatientId: parseInt(formData.patientId, 10),
                Title: formData.title.trim(),
                Message: formData.message.trim()
            });
            toast.success('Njoftimi u dërgua me sukses!');
            navigate('/menaxho-notifications');
        } catch (error) {
            toast.error(error.response?.data || 'Gabim në dërgimin e njoftimit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            <PsikologSidePanel section="njoftime" activePath="/add-notification" />

            {/* Përmbajtja kryesore */}
            <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
                <div className="container-fluid py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Dërgo Njoftim</h2>
                    </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="patientId">Pacienti *</label>
                            <select
                                id="patientId"
                                name="patientId"
                                value={formData.patientId}
                                onChange={(e) => {
                                    setFormData(prev => ({...prev, patientId: e.target.value}));
                                }}
                                required
                            >
                                <option value="">Zgjedh Pacientin</option>
                                {Array.isArray(patients) && patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.emri} {patient.mbiemri}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Titulli *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                maxLength={200}
                                placeholder="Shkruaj titullin e njoftimit"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Mesazhi *</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                maxLength={1000}
                                rows={6}
                                placeholder="Shkruaj mesazhin e njoftimit"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Duke dërguar...' : 'Dërgo Njoftimin'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => navigate('/menaxho-notifications')}
                                disabled={loading}
                            >
                                Anulo
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
}

export default AddNotification;
