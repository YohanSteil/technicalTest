import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Main.scss'

const Main = () => {
  const [token, setToken] = useState('');
  const [tests, setTests] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [page, setPage] = useState(1); // État pour stocker le numéro de la page actuelle
  const [limit, setLimit] = useState(9); // État pour stocker la limite d'éléments par page
  axios.defaults.baseURL = 'http://localhost:3000/'

  useEffect(() => {
    const fetchTests = async (lang, token, page, limit) => {
        try {
          const response = await axios.get(`api/${lang}/test/?page=${page}&limit=${limit}&sort=date`, {
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
        const response = await axios.get('token');
        console.log(response.data.token);
        
        // Vérifier si la requête a réussi
        if (response.status !== 200) {
          throw new Error('Failed to fetch token');
        }
        
        // Mettre à jour l'état du token avec le token reçu
        setToken(response.data.token);
        fetchTests(selectedLanguage, response.data.token, page, limit)
      } catch (error) {
        console.error('Error fetching token:', error);
        // Gérer les erreurs ici
      }
    };

    // Appeler la fonction fetchToken pour récupérer le token
    fetchToken();
  }, [selectedLanguage, page, limit]);


const handleLanguageChange = (event) => {
  setSelectedLanguage(event.target.value); // Update the selected language based on user selection
}

const handlePageChange = (newPage) => {
  if (newPage > 0) { // Vérification pour éviter que la pagination descende en dessous de 1
    setPage(newPage);
  }
};


  // Afficher le token une fois qu'il est récupéré
  return (

    <div className='main'> 
          <h2>Choississez votre langue:</h2>

<div class="select is-rounded">
<select onChange={handleLanguageChange} value={selectedLanguage}>
<option value={"fr"}>Français</option>
<option value={"en"}>Anglais</option>
</select>
</div>
      <h3 className='main__title'>Résultats des tests :</h3>
  
      <div className="test is-flex is-flex-direction-row is-flex-wrap-wrap">
        {tests.map((test, index) => (
          <div className='card' style={{ backgroundColor: test.color }} key={index}>
  
            <header className="card-header">
              <h2 className="card-header-title is-justify-content-center" style={{ color: 'white', fontSize: '1.5rem' }}>{test.title}</h2>
            </header>
           
            <div className="card-content">
              <div className="content" style={{ color: 'white', fontSize: '1.1rem' }}>
                <ul>
                  <li>{test.sub_title}</li>
                </ul>
              </div>
            </div>
  
            <footer className="card-footer">
              <a href="#" className="card-footer-item" style={{ color: 'white', fontSize: '1rem' }}>Save</a>
              <a href="#" className="card-footer-item" style={{ color: 'white', fontSize: '1rem' }}>Edit</a>
              <a href="#" className="card-footer-item" style={{ color: 'white', fontSize: '1rem' }}>Delete</a>
            </footer>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} className='button'>Previous</button>
        <span className='pagination__number'>{page}</span>
        <button onClick={() => handlePageChange(page + 1)} className='button'>Next</button>
      </div>
    </div>   
  );
  
};

export default Main;
