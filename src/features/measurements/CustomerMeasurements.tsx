"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface Measurement {
  measure_uuid: string;
  measure_datetime: string;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
}

export default function CustomerMeasurements() {
  const [customerCode, setCustomerCode] = useState<string>("");
  const [measureType, setMeasureType] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetchMeasurements = async () => {
    if (!customerCode) {
      toast({
        title: "Erro",
        description: "Por favor, insira o código do cliente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/${customerCode}/list${
          measureType ? `?measure_type=${measureType}` : ""
        }`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Erro",
          description:
            errorData.error_description || "Erro ao buscar leituras.",
          variant: "destructive",
        });
        setMeasurements(null);
        return;
      }

      const data = await response.json();
      setMeasurements(data.measures);
    } catch (error) {
      console.error("Erro ao buscar leituras:", error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Medições por Cliente
      </h1>

      <div className="mb-4">
        <Label htmlFor="customer-code">Código do Cliente</Label>
        <Input
          id="customer-code"
          type="text"
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
          placeholder="Digite o código do cliente"
          className="mt-2"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="measure-type">Tipo de Medida</Label>
        <Select onValueChange={setMeasureType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tipo de medida" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WATER">Água</SelectItem>
            <SelectItem value="GAS">Gás</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleFetchMeasurements}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Carregando..." : "Buscar Leituras"}
      </Button>

      <Separator className="my-6" />

      {measurements && measurements.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Leituras Encontradas</h2>
          <ul className="space-y-4">
            {measurements.map((measurement) => (
              <li
                key={measurement.measure_uuid}
                className="p-4 bg-gray-100 rounded-lg"
              >
                <p>
                  <strong>Data/Hora:</strong>{" "}
                  {new Date(measurement.measure_datetime).toLocaleString()}
                </p>
                <p>
                  <strong>Tipo:</strong> {measurement.measure_type}
                </p>
                <p>
                  <strong>Valor Confirmado:</strong>{" "}
                  {measurement.has_confirmed ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Imagem:</strong>{" "}
                  <a
                    href={measurement.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Imagem
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Nenhuma leitura encontrada.</p>
      )}
    </div>
  );
}
