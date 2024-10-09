import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { OpenCvContextProvider } from "./core/hooks/useOpenCv.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpenCvContextProvider>
      <App />
    </OpenCvContextProvider>
  </StrictMode>
);
