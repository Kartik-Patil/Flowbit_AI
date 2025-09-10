"use client";
import { useState, useEffect } from "react";

export default function InvoiceForm({ initialData, fileId, fileName }: any) {
  const [doc, setDoc] = useState<any>({
    vendor: { name: "", address: "", taxId: "" },
    invoice: { number: "", date: "", currency: "", subtotal: 0, taxPercent: 0, total: 0, lineItems: [] }
  });

  useEffect(() => { if (initialData) setDoc(initialData); }, [initialData]);

  async function save() {
    const payload = { fileId, fileName, ...doc};
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const j = await res.json();
    alert("Saved: " + j._id);
  }

  return (
    <div>
      <h2>Editable Invoice</h2>
      <label>Vendor name</label>
      <input value={doc.vendor?.name || ""} onChange={e => setDoc({...doc, vendor:{...doc.vendor, name: e.target.value}})} />
      <label>Invoice number</label>
      <input value={doc.invoice?.number || ""} onChange={e => setDoc({...doc, invoice:{...doc.invoice, number: e.target.value}})} />
      <div className="mt-4">
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
}
