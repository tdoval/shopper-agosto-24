"use client";

import { useState } from "react";
import ImageUploader from "@/features/upload/components/ImageUploader";
import UploadResult from "@/features/upload/components/UploadResult";

export default function UploadPage() {
  const [uploadResult, setUploadResult] = useState<{
    imageUrl: string;
    measureValue: number;
    measureUuid: string;
  } | null>(null);

  const handleUploadComplete = (data: {
    imageUrl: string;
    measureValue: number;
    measureUuid: string;
  }) => {
    setUploadResult(data);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Upload e Processamento de Imagem
      </h1>

      <ImageUploader onUploadComplete={handleUploadComplete} />

      {uploadResult && <UploadResult {...uploadResult} />}
    </div>
  );
}
