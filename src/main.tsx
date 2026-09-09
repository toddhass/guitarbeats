import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { armUnlock } from "./audio/unlock";

armUnlock(() => null);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
