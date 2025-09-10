import mongoose, { Schema } from "mongoose";

const LineItemSchema = new Schema({
  description: { type: String },
  unitPrice: { type: Number },
  quantity: { type: Number },
  total: { type: Number }
}, { _id: false });

const InvoiceSchema = new Schema({
  fileId: { type: String, required: true },
  fileName: { type: String, required: true },
  vendor: {
    name: String,
    address: String,
    taxId: String
  },
  invoice: {
    number: String,
    date: String,
    currency: String,
    subtotal: Number,
    taxPercent: Number,
    total: Number,
    poNumber: String,
    poDate: String,
    lineItems: [LineItemSchema]
  },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date }
});

export const Invoice = mongoose.model("Invoice", InvoiceSchema);
