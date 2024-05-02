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
          const response = await axios.get(`http://localhost:3000/api/fr/test/`, {
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



  // Afficher le token une fois qu'il est récupéré
  return (
    <> <div>
      <h2>Token</h2>
      <p>{token}</p>
      <h3>Résultats des tests : </h3>
      <ul>
        {/* {tests.map(test => (
          <li key={test.id}>
            <p>Ref: {test.ref}</p>
            <p>Title: {test.title}</p>
            <p>Sub Title: {test.sub_title}</p>
            <p>Color: {test.color}</p>
          </li>
        ))} */}
      </ul>
    </div>
    <div className="test is-flex is-flex-direction-row is-flex-wrap-wrap">
  {tests.map((test, index) => (
    <div className='card' style={{ backgroundColor: test.color }} key={index}>

      <header className="card-header">
        <h2 className="card-header-title is-justify-content-center " style={{color: 'white', fontSize: '1.5rem'}}>{test.title}</h2>
        {/* <button className="card-header-icon" aria-label="more options" onClick={toggleCard}>
          <span className="icon">
            <i className={`fas fa-angle-${isCardOpen ? 'up' : 'down'}`} aria-hidden="false"></i>
          </span>
        </button> */}
      </header>
     
        <div className="card-content">
          <div className="content " style={{color: 'white', fontSize: '1.1rem'}}>
            <ul>
              <li>{test.sub_title}</li>
            </ul>
            <br />
            
          </div>
        </div>
      <footer className="card-footer">
        <a href="#" className="card-footer-item" style={{color: 'white', fontSize: '1rem'}}>Save</a>
        <a href="#" className="card-footer-item" style={{color: 'white', fontSize: '1rem'}}>Edit</a>
        <a href="#" className="card-footer-item" style={{color: 'white', fontSize: '1rem'}}>Delete</a>
      </footer>
    </div>
  ))}
</div>

  </>   
  );
};

export default Main;
