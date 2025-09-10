"use client";
import { useState } from "react";
import PdfViewer from "./components/PdfViewer";
import InvoiceForm from "./components/InvoiceForm";
import axios from "axios";

export default function HomePage() {
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<any>(null);

  async function onUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, { method: "POST", body: fd });
    const json = await res.json();
    setFileId(json.fileId);
    setFileUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${json.fileId}`);
  }

  async function onExtract(model: "gemini" | "groq") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId, model })
    });
    const j = await res.json();
    setExtracted(j.extracted);
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r">
        <div className="p-4">
          <input type="file" accept="application/pdf" onChange={(e) => e.target.files && onUpload(e.target.files[0])} />
          <div className="mt-2">
            <button onClick={() => onExtract("gemini")}>Extract with Gemini</button>
            <button onClick={() => onExtract("groq")}>Extract with Groq</button>
          </div>
        </div>
        <PdfViewer fileUrl={fileUrl} />
      </div>
      <div className="w-1/2 p-4 overflow-auto">
        <InvoiceForm initialData={extracted} fileId={fileId} fileName={fileId ? "uploaded.pdf" : undefined} />
      </div>
    </div>
  );
}
