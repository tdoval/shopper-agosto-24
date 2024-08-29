"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ImageUploaderProps {
  onUploadComplete: (data: {
    base64Image: string;
    imageFilePath: string;
    publicImageUrl: string;
  }) => void;
}

export default function ImageUploader({
  onUploadComplete,
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error_description || "Erro ao processar a imagem.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      onUploadComplete(data);
    } catch (err) {
      setError("Erro ao se conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <Label
        htmlFor="image-upload"
        className="block text-sm font-medium text-gray-700"
      >
        Selecione uma imagem:
      </Label>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        id="image-upload"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
