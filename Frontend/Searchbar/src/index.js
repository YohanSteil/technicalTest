import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Header from "./Components/Header/Header";
import Main from "./Components/Main/Main";
import CreateTest from "./Components/CreateTest/CreateTest";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        fontSize: "1.5rem",
      }}
      toastOptions={{
        duration: 3000,
        style: {
          boxShadow: "rgba(0, 0, 0, 0.8) 0px 19px 38px",
          border: "1px solid grey",
        },
      }}
    />

    <Header />
    <CreateTest />
    <Main />
  </div>
);
