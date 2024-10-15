import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { OpenCvContextProvider } from "./core/hooks/useOpenCv.tsx";
import { ThemeProvider } from "./core/hooks/useTheme.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpenCvContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </OpenCvContextProvider>
  </StrictMode>
);
