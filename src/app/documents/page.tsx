"use client";

import { api } from "@/lib/axios";
import { useState } from "react";

export default function Documents() {
  const [result] = useState("");

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.file as unknown as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/documents/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data.text)
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" accept="application/pdf" />
      <button type="submit">Analyze PDF</button>
      <pre>{result}</pre>
    </form>
  );
}
