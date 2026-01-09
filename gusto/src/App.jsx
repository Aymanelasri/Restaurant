import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import ScrollReveal from './Salade/ScrollReveal';
import Accueil from './Accueil';
import Filiere from './Filiere';
import Modules from './Modules';
import DetailsModule from './DetailsModule';
import FormRecherche from './FormRecherche';
import Ligne from './Ligne';
import NotFound from './NotFound';

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
            <NavBar />
            <ScrollReveal />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Accueil />} />
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