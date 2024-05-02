import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Main.css'

const Main = () => {
  const [token, setToken] = useState('');
  const [tests, setTests] = useState([]);
  const [isCardOpen, setIsCardOpen] = useState(false);

  useEffect(() => {
    const fetchTests = async (lang, token) => {
        try {
          const response = await axios.get(`http://localhost:3000/api/en/test/`, {
            headers: {
              Authorization: token
            }
          });
          
          if (response.status === 200) {
            // Gérer la réponse ici
            console.log(response.data.data);
            setTests(response.data.data);
          } else {
            throw new Error('Failed to fetch tests');
          }
        } catch (error) {
          console.error('Error fetching tests:', error);
          // Gérer les erreurs ici
        }
      };

    const fetchToken = async () => {
      try {
        // Effectuer une requête GET pour obtenir le token
        const response = await axios.get('http://localhost:3000/token');
        console.log(response.data.token);
        
        // Vérifier si la requête a réussi
        if (response.status !== 200) {
          throw new Error('Failed to fetch token');
        }
        
        // Mettre à jour l'état du token avec le token reçu
        setToken(response.data.token);
        fetchTests('fr', response.data.token)
      } catch (error) {
        console.error('Error fetching token:', error);
        // Gérer les erreurs ici
      }
    };

    // Appeler la fonction fetchToken pour récupérer le token
    fetchToken();
  }, []);

  const toggleCard = () => {
    setIsCardOpen(!isCardOpen);
  };



  // Afficher le token une fois qu'il est récupéré
  return (
    <> <div>
      <h2>Token</h2>
      <p>{token}</p>
      <h3>Résultats des tests : </h3>
      <ul>
        {tests.map(test => (
          <li key={test.id}>
            <p>Ref: {test.ref}</p>
            <p>Title: {test.title}</p>
            <p>Sub Title: {test.sub_title}</p>
            <p>Color: {test.color}</p>
          </li>
        ))}
      </ul>
    </div>
    <div className="card">
    <header className="card-header">
      <p className="card-header-title">Component</p>
      <button className="card-header-icon" aria-label="more options" onClick={toggleCard}>
        <span className="icon">
        <i className={`fas fa-angle-${isCardOpen ? 'up' : 'down'}`} aria-hidden="false"></i>
        </span>
      </button>
    </header>
    {isCardOpen && (
      <div className="card-content">
        <div className="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
          iaculis mauris.
          <br />
          <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
        </div>
      </div>
    )}
    <footer className="card-footer">
      <a href="#" className="card-footer-item">Save</a>
      <a href="#" className="card-footer-item">Edit</a>
      <a href="#" className="card-footer-item">Delete</a>
    </footer>
  </div>
  </>   
  );
};

export default Main;
