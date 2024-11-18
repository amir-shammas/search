import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import './styles/reset.css'
import './styles/fonts.css'
import './styles/variables.css'
import './styles/helpers.css'
import './styles/defaults.css'
import './styles/cms.css'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

