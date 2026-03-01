import React from "react";
import { createRoot } from "react-dom/client";
import { NoteReaderPage } from "./features/noteReader";
import "./style.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root not found");
}

createRoot(container).render(
  <React.StrictMode>
    <NoteReaderPage />
  </React.StrictMode>
);


