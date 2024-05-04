import React, { useState } from "react";
import axios from "axios";
import "./CreateTest.scss";
axios.defaults.baseURL = "http://localhost:3000/";

const CreateTest = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [formData, setFormData] = useState({
    title_en: "",
    title_fr: "",
    sub_title_en: "",
    sub_title_fr: "",
    color: "",
    is_active: "",
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
      //  requête GET pour obtenir le token
      const response = await axios.get("token");
      console.log(response.data.token);

      // Vérifie si la requête a réussi
      if (response.status !== 200) {
        throw new Error("Failed to fetch token");
      }

      return response;
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const handleSubmit = async (lang) => {
    try {
      const tokenResponse = await fetchToken();
      const token = tokenResponse.data.token;
      //   console.log(token);

      const testData = {
        title: {
          en: formData.title_en,
          fr: formData.title_fr,
        },
        sub_title: {
          en: formData.sub_title_en,
          fr: formData.sub_title_fr,
        },
        color: formData.color,
        is_active: formData.is_active,
      };

      const response = await axios.post(`api/en/test/`, testData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      //   console.log(response);
      setFormData({
        title_en: "",
        title_fr: "",
        sub_title_en: "",
        sub_title_fr: "",
        color: "",
        is_active: "",
      });
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  };

  return (
    <div className="createTest">
      <button onClick={handleOpenModal} className="createTest__button">
        Créer un nouveau test
      </button>
      <div className={`modal ${isModalActive ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <h1 className="modal-content__title">Ajout d'un test</h1>
          {/* <input className="input" type="text" placeholder="ref" name='ref'  value={formData.ref}
    onChange={handleChange} /> */}
          <h2 style={{ color: "white", fontSize: "2rem" }}>Titre</h2>
          <input
            className="input"
            type="text"
            placeholder="Title english"
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
          />
          <input
            className="input"
            type="text"
            placeholder="Title french"
            name="title_fr"
            value={formData.title_fr}
            onChange={handleChange}
          />
          <input
            className="input"
            type="text"
            placeholder="sub_title english"
            name="sub_title_en"
            value={formData.sub_title_en}
            onChange={handleChange}
          />
          <input
            className="input"
            type="text"
            placeholder="sub_title french"
            name="sub_title_fr"
            value={formData.sub_title_fr}
            onChange={handleChange}
          />
          <input
            className="input"
            type="text"
            placeholder="is_active"
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
          />
          <input
            className="input"
            type="text"
            placeholder="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
          <button className="button" onClick={handleSubmit}>
            Button
          </button>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={handleCloseModal}
        ></button>
      </div>
    </div>
  );
};

export default CreateTest;
