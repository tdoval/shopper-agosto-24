"use client";

import { useState, useEffect, useTransition } from "react";
import ImageUploader from "@/features/upload/components/ImageUploader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadResult from "@/features/upload/components/UploadResult";
import { toast } from "@/components/ui/use-toast";

export default function UploadPage() {
  const [uploadData, setUploadData] = useState<{
    selectedCustomer: string | null;
    measureUUID: string | null;
    measureType: string | null;
    measureValue: number | null;
    base64Image: string | null;
    imageFilePath: string | null;
    publicImageUrl: string | null;
  }>({
    selectedCustomer: null,
    measureUUID: null,
    measureType: null,
    measureValue: null,
    base64Image: null,
    imageFilePath: null,
    publicImageUrl: null,
  });

  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [isPending, startTransition] = useTransition();
  const isLoading = isPending;

  useEffect(() => {
    async function fetchCustomers() {
      const response = await fetch("/api/customers");
      const data = await response.json();
      setCustomers(data.customers);
    }

    fetchCustomers();
  }, []);

  useEffect(() => {
    console.log("Dados atualizados:", uploadData);
  }, [uploadData]);

  const handleUploadComplete = (data: {
    base64Image: string;
    imageFilePath: string;
    publicImageUrl: string;
  }) => {
    setUploadData((prev) => ({
      ...prev,
      base64Image: data.base64Image,
      imageFilePath: data.imageFilePath,
      publicImageUrl: data.publicImageUrl,
    }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const { selectedCustomer, measureType, base64Image } = uploadData;

      if (selectedCustomer && measureType && base64Image) {
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64Image,
              customerId: selectedCustomer,
              measure_datetime: new Date().toISOString(),
              measure_type: measureType,
              publicImageUrl: uploadData.publicImageUrl,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            toast({
              title: "Erro",
              description:
                errorData.error_description || "Falha ao processar o upload",
              variant: "destructive",
            });
            return;
          }

          const data = await response.json();
          console.log("Upload bem-sucedido:", data);
          setUploadData((prev) => ({
            ...prev,
            measureUUID: data.measureUUID,
            measureValue: data.measureValue,
          }));
          toast({
            title: "Sucesso",
            description: "Upload e processamento bem-sucedidos!",
            variant: "default",
          });
        } catch (error) {
          console.error("Erro ao enviar os dados:", error);
          toast({
            title: "Erro",
            description: "Erro ao conectar com o servidor.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro",
          description:
            "Por favor, selecione um cliente, o tipo de medida e faça o upload da imagem.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Upload e Processamento de Imagem
      </h1>

      <div className="mb-4">
        <Select
          onValueChange={(value) =>
            setUploadData((prev) => ({ ...prev, selectedCustomer: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Select
          onValueChange={(value) =>
            setUploadData((prev) => ({ ...prev, measureType: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tipo de medida" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WATER">Water</SelectItem>
            <SelectItem value="GAS">Gas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ImageUploader onUploadComplete={handleUploadComplete} />

      {uploadData.publicImageUrl && (
        <img
          src={uploadData.publicImageUrl}
          alt="Imagem do Medidor"
          className="rounded-lg shadow-sm"
        />
      )}
      {uploadData.measureValue !== null && (
        <UploadResult
          measureValue={uploadData.measureValue}
          measureUuid={uploadData.measureUUID}
        />
      )}

      <Button
        onClick={handleSubmit}
        className="w-full mt-6"
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Confirmar Upload"}
      </Button>
    </div>
  );
}
