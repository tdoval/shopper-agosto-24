"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface Measurement {
  measure_uuid: string;
  customer: {
    name: string;
  };
  measure_type: string;
  measure_value: number;
}

interface SearchMeasurementProps {
  onMeasureSelected: (measure: Measurement) => void;
}

export default function SearchMeasurement({
  onMeasureSelected,
}: SearchMeasurementProps) {
  const [measureUUID, setMeasureUUID] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMeasure, setSelectedMeasure] = useState<Measurement | null>(
    null,
  );

  const handleSearch = async () => {
    if (!measureUUID) {
      toast({
        title: "Erro",
        description: "Por favor, insira um UUID válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/measurements/${measureUUID}`);

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Erro",
          description: errorData.error_description || "Medição não encontrada.",
          variant: "destructive",
        });
        setSelectedMeasure(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSelectedMeasure(data.measurement);
      onMeasureSelected(data.measurement);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      });
      setSelectedMeasure(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <Label htmlFor="measure-uuid">Buscar Medição pelo UUID</Label>
      <Input
        id="measure-uuid"
        value={measureUUID}
        onChange={(e) => setMeasureUUID(e.target.value)}
        placeholder="Insira o UUID da medição"
        className="mt-2 mb-4"
      />
      <Button onClick={handleSearch} disabled={loading} className="w-full">
        {loading ? "Buscando..." : "Buscar Medição"}
      </Button>

      {selectedMeasure && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Detalhes da Medição</h2>
          <p>
            <strong>Cliente:</strong> {selectedMeasure.customer.name}
          </p>
          <p>
            <strong>Tipo:</strong> {selectedMeasure.measure_type}
          </p>
          <p>
            <strong>Valor Atual:</strong> {selectedMeasure.measure_value}
          </p>
          <Separator className="my-4" />
        </div>
      )}
    </div>
  );
}
