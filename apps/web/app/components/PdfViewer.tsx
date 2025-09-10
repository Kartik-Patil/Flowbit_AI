"use client";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ fileUrl }: { fileUrl: string | null }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.2);

  if (!fileUrl) return <div>No PDF loaded</div>;

  return (
    <div className="p-2">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}>-</button>
        <button onClick={() => setScale((s) => s + 0.2)}>+</button>
        <span>Page</span>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <button onClick={() => setPage((p) => Math.min(numPages || 1, p + 1))}>Next</button>
      </div>

      <div style={{ overflow: "auto", border: "1px solid #ddd", height: "70vh" }}>
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages: n }: any) => setNumPages(n)}
          options={{ disableWorker: false }}
        >
          <Page pageNumber={page} scale={scale} />
        </Document>
      </div>

      <div className="mt-2">Page {page} / {numPages || "?"}</div>
    </div>
  );
}
