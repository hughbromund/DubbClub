import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import HttpsRedirect from "react-https-redirect";
import AuthProvider from "./contexts/AuthProvider";

ReactDOM.render(
  <React.StrictMode>
    <HttpsRedirect>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HttpsRedirect>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
