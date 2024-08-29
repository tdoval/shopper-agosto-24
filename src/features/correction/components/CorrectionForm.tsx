"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface CorrectionFormProps {
  selectedMeasure: {
    measure_uuid: string;
    customer: {
      name: string;
    };
    measure_type: string;
    measure_value: number;
  } | null;
  onSubmit: (measure_uuid: string, newValue: number) => Promise<void>;
  isSubmitting: boolean;
}

export default function CorrectionForm({
  selectedMeasure,
  onSubmit,
  isSubmitting,
}: CorrectionFormProps) {
  const [newValue, setNewValue] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedMeasure && newValue !== null) {
      onSubmit(selectedMeasure.measure_uuid, newValue);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, insira um novo valor válido.",
        variant: "destructive",
      });
    }
  };

  if (!selectedMeasure) {
    return <p>Selecione uma leitura na lista ao lado para corrigi-la.</p>;
  }

  return (
    <div>
      <div className="mb-4">
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

      <div className="mb-4">
        <Label htmlFor="new-value">Novo Valor</Label>
        <Input
          id="new-value"
          type="number"
          value={newValue ?? ""}
          onChange={(e) => setNewValue(Number(e.target.value))}
          className="mt-2"
        />
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting} className="mt-4">
        {isSubmitting ? "Enviando..." : "Confirmar Correção"}
      </Button>
    </div>
  );
}
