import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";

export let gfsBucket: GridFSBucket | null = null;

export async function connectDB(uri: string) {
  await mongoose.connect(uri);
  const db = mongoose.connection.db as any;
  gfsBucket = new GridFSBucket(db, { bucketName: "pdfs" });
  console.log("MongoDB connected, GridFS bucket ready");
}
