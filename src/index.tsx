import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/css/bootstrap.min.css"; //Bootstrap CSS
import "./assets/css/bootstrap-select.min.1.14.css"; //NIce Select CSS
import "./assets/fonts/custom-font.css"; //Custom Font CSS
import "./assets/fonts/icomoon/style.css"; //Custom Font CSS
import "./assets/css/style.css"; //Style Custom CSS
import "./assets/css/custom.css"; //Style Custom CSS
import "./assets/css/responsive.css"; //Style Custom CSS
import "./assets/css/daterangepicker.css"; //DatepickerCSS
import "./assets/css/dataTables.bootstrap5.min.css"; //dataTables
import "./assets/css/DraggableNestableList.min.css"; //Draggable Nestable List
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-select/dist/js/bootstrap-select.min.js";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter basename={'/corporate'}>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
