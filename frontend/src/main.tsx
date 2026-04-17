import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ScanProvider } from "./app/store/scanStore.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ScanProvider>
    <App />
  </ScanProvider>
);
