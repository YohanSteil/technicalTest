import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <>
      <div className="header">
        <img
          className="header__img"
          src="https://qa.deepsy.fr/images/svg/logo-deepsy-svg.svg"
          alt=""
        />
        <h1 className="header__title">Test Technique </h1>
      </div>
    </>
  );
};

export default Header;
