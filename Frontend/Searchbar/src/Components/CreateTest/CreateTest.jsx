import React, { useState } from 'react';
import axios from 'axios';
import './CreateTest.scss';

const CreateTest = () => {
    
    const [isModalActive, setIsModalActive] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        sub_title: '',
        color: '',
        is_active: '',
    });

    const handleOpenModal = () => {
        setIsModalActive(true);
    };

    const handleCloseModal = () => {
        setIsModalActive(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchToken = async () => {
        try {
            // Effectuer une requête GET pour obtenir le token
            const response = await axios.get('token');
            console.log(response.data.token);
              
            // Vérifier si la requête a réussi
            if (response.status !== 200) {
                throw new Error('Failed to fetch token');
            }
              
            return response; // Retourner la réponse pour obtenir le token
        } catch (error) {
            console.error('Error fetching token:', error);
            // Gérer les erreurs ici
        }
    };

    const handleSubmit = async () => {
        try {
            // Attendre la réponse de fetchToken
            const tokenResponse = await fetchToken();

            // Extraire le token de la réponse
            const token = tokenResponse.data.token;
            console.log(token);

            const testData = {
                title: formData.title,
                sub_title: formData.sub_title,
                color: formData.color,
                is_active: formData.is_active
            };


            const response = await axios.post(
                'api/fr/test/',
                testData,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token // Passer le jeton dans le header Authorization
                    }
                }
            );
            console.log(response); // Afficher la réponse du serveur
            // Réinitialiser le formulaire après l'envoi des données si nécessaire
            setFormData({
                title: '',
                sub_title: '',
                color: '',
                is_active: '',
            });
            handleCloseModal();
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données :', error);
        }
    };

    return (
        <div className='test'>
            <button onClick={handleOpenModal}><h2>Crée un nouveau test</h2></button>
            <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <h1 className='modal-content__title'>Ajout d'un test</h1>
                    {/* <input className="input" type="text" placeholder="ref" name='ref'  value={formData.ref}
    onChange={handleChange} /> */}
    <h2 style={{color:'white', fontSize:'2rem'}}>Titre</h2>
                    <input className="input" type="text" placeholder="Title english" name='title'  value={formData.title}
    onChange={handleChange}/>
    <input className="input" type="text" placeholder="Title french" name='title'  value={formData.title}
    onChange={handleChange}/>
                    <input className="input" type="text" placeholder="sub_title english" name='sub_title'  value={formData.sub_title}
    onChange={handleChange} />
    <input className="input" type="text" placeholder="sub_title french" name='sub_title'  value={formData.sub_title}
    onChange={handleChange} />
                    <input className="input" type="text" placeholder="is_active" name='is_active'  value={formData.is_active}
    onChange={handleChange}/>
                    <input className="input" type="text" placeholder="color" name='color'  value={formData.color}
    onChange={handleChange}/>
                    <button className="button" onClick={handleSubmit}>Button</button>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={handleCloseModal}></button>
            </div>
        </div>
    );
};

export default CreateTest;
