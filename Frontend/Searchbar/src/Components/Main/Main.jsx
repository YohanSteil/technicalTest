import React, { useState, useEffect, Link} from 'react';
// import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import './Main.scss'
import ModalContent from '../modalContent/modalContentUpdate';

const Main = () => {
  // const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [tests, setTests] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [page, setPage] = useState(1); // État pour stocker le numéro de la page actuelle
  const [limit, setLimit] = useState(9); // État pour stocker la limite d'éléments par page
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour contrôler la visibilité de la modal
  const [selectedTestId, setSelectedTestId] = useState(null); // Stocker l'ID du test sélectionné

  const [searchColor, setSearchColor] = useState(''); // État pour stocker la couleur de recherche
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchSubTitle, setSearchSubTitle] = useState('');
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

  // Fonction pour filtrer les tests en fonction de la couleur saisie
  const filterTests = () => {
    // Si la couleur saisie est vide, afficher tous les tests
    if (!searchColor) {
      setFilteredTests(tests);
    } else {
      // Filtrer les tests en fonction de la couleur saisie
      const filtered = tests.filter(test => test.color === searchColor);
      setFilteredTests(filtered);
    }
  };

  const filterTestsByTitle = () => {
    if (!searchTitle) {
      setFilteredTests(tests);
    } else {
      const filteredTitle = tests.filter(test => test.title.toLowerCase().startsWith(searchTitle.toLowerCase()));
      setFilteredTests(filteredTitle);
    }
  };

  const filterTestsBySubtitle = () => {
    if(!searchSubTitle) {
      setFilteredTests(tests); 
    } else {
      const filteredSubTitle = tests.filter(test => test.sub_title.toLowerCase().startsWith(searchSubTitle.toLowerCase()))
      setFilteredTests(filteredSubTitle)
    }
  }
  

  useEffect(() => {
    filterTests();
  }, [searchColor, tests]);

  useEffect(() => {
    filterTestsByTitle(); 
  }, [searchTitle, tests])

  useEffect(() => {
    filterTestsBySubtitle();
  }, [searchSubTitle, tests])



const handleLanguageChange = (event) => {
  setSelectedLanguage(event.target.value); // Update the selected language based on user selection
}


const handlePageChange = (newPage) => {
  if (newPage > 0) { // Vérification pour éviter que la pagination descende en dessous de 1
    setPage(newPage);
  }
};

const handleUpdate = (id) => {
  // Ici, vous pouvez effectuer une action de mise à jour, comme afficher un formulaire de modification
  console.log('Modifier le test avec l\'ID :', id);
  setSelectedTestId(id); // Stocker l'ID du test sélectionné
  setIsModalOpen(true);
  console.log(isModalOpen);
};

const handleDelete  = async (lang, id) => {
  try {
    const response = await axios.delete(`api/${lang}/test/${id}`, {
      headers: {
        Authorization: token
      }
    });

    setTests(tests.filter(test => test.id !== id));
    
  console.log(response);
  } catch (error) {
    console.error('Error fetching tests:', error);
    // Gérer les erreurs ici
  }
};

const handleColorChange = (event) => {
  setSearchColor(event.target.value);
};

const handleTitleChange = (event) => {
  setSearchTitle(event.target.value);
};

const handleSubTitleChange = (event) => {
  setSearchSubTitle(event.target.value)
}

const handleSearch = () => {
  // Vérifier si la couleur saisie est valide (par exemple, une chaîne hexadécimale)
  if (/^#[0-9A-F]{6}$/i.test(searchColor)) {

  } else {
    // Couleur invalide, ne pas effectuer de recherche
    // Vous pouvez afficher un message d'erreur ou ignorer la recherche
    console.log("Couleur saisie invalide");
  }
};



  return (

    <div className='main'> 
    <div className='main__language'>
    <h2 className='main__title'>Choississez votre langue:</h2>
          <div className="select is-rounded">
<select onChange={handleLanguageChange} value={selectedLanguage}>
<option value={"fr"}>Français</option>
<option value={"en"}>Anglais</option>
</select>
</div>
      </div>
      
      <div className='search-bar'>
        <div className='search-bar__title'>
    <h2>Barre de recherche</h2>
        </div>
        <div className='search-bar__research'>
    <div className="search-bar__research__color">
  <input type="text" placeholder="Rechercher par couleur..." value={searchColor} onChange={handleColorChange} />
</div>

<div className="search-bar__research__title">
  <input type="text" placeholder="Rechercher par titre..." value={searchTitle} onChange={handleTitleChange} />
</div>  

<div className="search-bar__research__subTitle">
  <input type="text" placeholder="Rechercher par sous-titre..." value={searchSubTitle} onChange={handleSubTitleChange} />
          </div>
          </div>
    </div>
          
      <h3 className='main__result'>Résultats des tests :</h3>
  
      <div className="test">
        {filteredTests.map((test, index) => (
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
            <a href="#" className="card-footer-item" style={{ color: 'white', fontSize: '1rem' }} onClick={() => handleUpdate(test.id)}>Modifier</a>

              <a href="#" className="card-footer-item" style={{ color: 'white', fontSize: '1rem' }} onClick={() => handleDelete(selectedLanguage, test.id)}>Supprimer</a>
            </footer>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} className='button'>Previous</button>
        <span className='pagination__number'>{page}</span>
        <button onClick={() => handlePageChange(page + 1)} className='button'>Next</button>
      </div>
      {isModalOpen && <ModalContent handleCloseModal={() => setIsModalOpen(false)} testId={selectedTestId} />} 
    </div>   
  );
  
};

export default Main;
