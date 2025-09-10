// WARNING: This is a minimal example. Use the official SDK in prod.
import fetch from "node-fetch";

export async function callGemini(text: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  // Simple REST example: tell the model to output JSON matching the minimal shape
  const prompt = `Extract invoice fields as JSON with keys:
  vendor: {name,address,taxId}, invoice: {number,date,currency,subtotal,taxPercent,total,poNumber,poDate,lineItems:[{description,unitPrice,quantity,total}]}
  from the following document text:\n\n${text}\n\nReturn valid JSON only.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const j = await resp.json();
  // parsing depends on the response shape; unwrap safely
  const outText = (j?.candidates?.[0]?.content ?? j?.output_text) || JSON.stringify(j);
  // attempt to parse JSON
  try { return JSON.parse(outText); } catch { return { raw: outText }; }
}
