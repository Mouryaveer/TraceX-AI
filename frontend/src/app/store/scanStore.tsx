import { createContext, useContext, useState, ReactNode } from "react";
import type { SearchResponse } from "../services/api";

export type ScanStatus = "idle" | "uploading" | "scanning" | "results" | "error";

interface ScanState {
  status: ScanStatus;
  file: File | null;
  results: SearchResponse | null;
  error: string | null;
  setFile: (file: File | null) => void;
  setStatus: (status: ScanStatus) => void;
  setResults: (results: SearchResponse) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const ScanContext = createContext<ScanState | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStatus("idle");
    setFile(null);
    setResults(null);
    setError(null);
  };

  return (
    <ScanContext.Provider value={{ status, file, results, error, setFile, setStatus, setResults: (r) => { setResults(r); setStatus("results"); }, setError: (e) => { setError(e); setStatus("error"); }, reset }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScan must be used inside ScanProvider");
  return ctx;
}
