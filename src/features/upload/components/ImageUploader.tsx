"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ImageUploaderProps {
  onUploadComplete: (data: {
    imageUrl: string;
    measureValue: number;
    measureUuid: string;
  }) => void;
}

export default function ImageUploader({
  onUploadComplete,
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida.");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor, selecione uma imagem antes de enviar.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
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

      <Button
        onClick={handleUpload}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Converter e Enviar"}
      </Button>
    </div>
  );
}
