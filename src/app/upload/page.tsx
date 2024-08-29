"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/features/upload/components/ImageUploader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UploadPage() {
  const [uploadData, setUploadData] = useState<{
    selectedCustomer: string | null;
    measureType: string | null;
    base64Image: string | null;
  }>({
    selectedCustomer: null,
    measureType: null,
    base64Image: null,
  });

  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    async function fetchCustomers() {
      const response = await fetch("/api/customers");
      const data = await response.json();
      setCustomers(data.customers);
    }

    fetchCustomers();
  }, []);

  const handleUploadComplete = (data: { base64Image: string }) => {
    setUploadData((prev) => ({
      ...prev,
      base64Image: data.base64Image,
    }));
  };

  const handleSubmit = async () => {
    const { selectedCustomer, measureType, base64Image } = uploadData;

    if (selectedCustomer && measureType && base64Image) {
      console.log("Customer ID:", selectedCustomer);
      console.log("Measure Type:", measureType);
      console.log("Base64 Image:", base64Image);

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
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(
            `Erro: ${
              errorData.error_description || "Falha ao processar o upload"
            }`,
          );
          return;
        }

        const data = await response.json();
        console.log("Upload bem-sucedido:", data);
        // @TODO: lidar com resposta do backend
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
    } else {
      alert("Please select a customer, measure type, and upload an image.");
    }
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

      <Button onClick={handleSubmit} className="w-full mt-6">
        Confirmar Upload
      </Button>
    </div>
  );
}
