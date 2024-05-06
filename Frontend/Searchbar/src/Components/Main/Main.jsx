import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Main.scss";
import ModalContent from "../modalContent/modalContentUpdate";

const Main = () => {
  const [token, setToken] = useState("");
  const [tests, setTests] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchColor, setSearchColor] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchSubTitle, setSearchSubTitle] = useState("");
  const [numTestsPerPage, setNumTestsPerPage] = useState(9);
  axios.defaults.baseURL = "http://localhost:3000/";

  const filterTests = () => {
    let filteredTests = tests.filter((test) => {
      if (
        searchColor &&
        test.color.toLowerCase() !== searchColor.toLowerCase()
      ) {
        return false;
      }
      if (
        searchTitle &&
        !test.title.toLowerCase().startsWith(searchTitle.toLowerCase())
      ) {
        return false;
      }
      if (
        searchSubTitle &&
        !test.sub_title.toLowerCase().startsWith(searchSubTitle.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    setFilteredTests(filteredTests);
  };

  useEffect(() => {
    const fetchTests = async (lang, token, page, limit) => {
      try {
        const response = await axios.get(
          `api/${lang}/test/?page=${page}&limit=${limit}&sort=date`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status === 200) {
          setTests(response.data.data);
        } else {
          throw new Error("Failed to fetch tests");
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    const fetchToken = async () => {
      try {
        const response = await axios.get("token");
        if (response.status !== 200) {
          throw new Error("Failed to fetch token");
        }
        setToken(response.data.token);
        fetchTests(selectedLanguage, response.data.token, page, limit);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [selectedLanguage, page, limit]);

  useEffect(() => {
    setLimit(numTestsPerPage);
    filterTests();
  }, [searchColor, searchTitle, searchSubTitle, tests, numTestsPerPage]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  const handleUpdate = (id) => {
    setSelectedTestId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (lang, id) => {
    try {
      const response = await axios.delete(`api/${lang}/test/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setTests(tests.filter((test) => test.id !== id));
      toast.success("Test supprimé");
      console.log(response);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const handleColorChange = (event) => {
    setSearchColor(event.target.value);
  };

  const handleTitleChange = (event) => {
    setSearchTitle(event.target.value);
  };

  const handleSubTitleChange = (event) => {
    setSearchSubTitle(event.target.value);
  };

  const handleNumTestsPerPageChange = (event) => {
    const numPerPage = parseInt(event.target.value);
    if (!isNaN(numPerPage) && numPerPage > 0) {
      setNumTestsPerPage(numPerPage);
    }
  };

  return (
    <div className="main">
      <div className="main__language">
        <h2 className="main__title">Choississez votre langue:</h2>
        <div className="select is-rounded">
          <select onChange={handleLanguageChange} value={selectedLanguage}>
            <option value={"fr"}>Français</option>
            <option value={"en"}>Anglais</option>
          </select>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-bar__title">
          <h2>Barre de recherche</h2>
        </div>
        <div className="search-bar__research">
          <div className="search-bar__research__color">
            <input
              type="text"
              placeholder="Rechercher couleur (ex:#ff00ff)"
              value={searchColor}
              onChange={handleColorChange}
            />
          </div>

          <div className="search-bar__research__title">
            <input
              type="text"
              placeholder="Rechercher par titre..."
              value={searchTitle}
              onChange={handleTitleChange}
            />
          </div>

          <div className="search-bar__research__subTitle">
            <input
              type="text"
              placeholder="Rechercher par sous-titre..."
              value={searchSubTitle}
              onChange={handleSubTitleChange}
            />
          </div>
        </div>
      </div>

      <div className="main__num">
        <div className="main__num-tests-per-page">
          <label htmlFor="numTestsPerPage">Nombre de tests par page :</label>
          <input
            type="number"
            id="numTestsPerPage"
            min="1"
            value={numTestsPerPage}
            onChange={handleNumTestsPerPageChange}
          />
        </div>
      </div>

      <h3 className="main__result">Résultats des tests :</h3>

      <div className="test">
        {filteredTests.map((test, index) => (
          <div
            className="card"
            style={{ backgroundColor: test.color }}
            key={index}
          >
            <header className="card-header">
              <h2
                className="card-header-title is-justify-content-center"
                style={{ color: "white", fontSize: "1.5rem" }}
              >
                {test.title}
              </h2>
            </header>

            <div className="card-content">
              <div
                className="content"
                style={{ color: "white", fontSize: "1.1rem" }}
              >
                <ul>
                  <li>{test.sub_title}</li>
                </ul>
              </div>
            </div>

            <footer className="card-footer">
              <a
                href="#"
                className="card-footer-item"
                style={{ color: "white", fontSize: "1rem" }}
                onClick={() => handleUpdate(test.id)}
              >
                Modifier
              </a>

              <a
                href="#"
                className="card-footer-item"
                style={{ color: "white", fontSize: "1rem" }}
                onClick={() => handleDelete(selectedLanguage, test.id)}
              >
                Supprimer
              </a>
            </footer>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} className="button">
          Précédent
        </button>
        <span className="pagination__number">{page}</span>
        <button onClick={() => handlePageChange(page + 1)} className="button">
          Suivant
        </button>
      </div>
      {isModalOpen && (
        <ModalContent
          handleCloseModal={() => setIsModalOpen(false)}
          testId={selectedTestId}
        />
      )}
    </div>
  );
};

export default Main;
