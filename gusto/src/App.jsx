import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import ScrollReveal from './Salade/ScrollReveal';
import Accueil from './Accueil';
import Filiere from './Filiere';
import Modules from './Modules';
import DetailsModule from './DetailsModule';
import FormRecherche from './FormRecherche';
import Ligne from './Ligne';
import NotFound from './NotFound';
import Login from './Salade/Login';
import Reservation from './Salade/Reservation';
import ForgotPassword from './Salade/ForgotPassword.jsx';
import ResetPassword from './Salade/ResetPassword.jsx';

function AuthHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log('AuthHandler - Current URL:', window.location.href);
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const user = params.get('user');
        
        console.log('AuthHandler - Token from URL:', token);
        console.log('AuthHandler - User from URL:', user);
        
        if (token && user) {
            console.log('AuthHandler - Saving to localStorage');
            localStorage.setItem('token', token);
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', user);
            
            console.log('AuthHandler - Saved token:', localStorage.getItem('token'));
            console.log('AuthHandler - Saved user:', localStorage.getItem('user'));
            
            console.log('AuthHandler - Redirecting to /reservation');
            window.location.href = '/reservation';
        }
    }, [location, navigate]);
    
    return null;
}

export default function App() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://localhost:8000/modules')
            .then(res => res.json())
            .then(data => {
                setModules(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const deleteModule = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
            setModules(modules.filter(module => module.id !== id));
        }
    };

    return (
        <Router>
            <AuthHandler />
            <NavBar />
            <ScrollReveal />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Accueil />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/reservation" element={<Reservation />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/filieres" element={<Filiere modules={modules} />} />
                    <Route path="/modules" element={
                        <>
                            <FormRecherche />
                            {loading ? (
                                <p>Chargement...</p>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nom</th>
                                            <th>Filière</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modules.map(module => (
                                            <Ligne 
                                                key={module.id} 
                                                module={module} 
                                                onDelete={deleteModule}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    } />
                    <Route path="/modules/1" element={<div>Module 1</div>} />
                    <Route path="/modules/module/:id" element={<DetailsModule modules={modules} />} />
                    <Route path="/filieres/module/:x/:y" element={<div>Module spécifique</div>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}