import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CaseRoom } from "../app/case-room/CaseRoom.tsx";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CaseRoom />
  </StrictMode>,
);
