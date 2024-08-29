"use client";

import { useState } from "react";
import CorrectionForm from "@/features/correction/components/CorrectionForm";
import SearchMeasurement from "@/features/correction/components/SearchMeasurement";
import RecentMeasurements from "@/features/correction/components/RecentMeasurements";
import { toast } from "@/components/ui/use-toast";

export default function CorrectionPage() {
  const [selectedMeasure, setSelectedMeasure] = useState<{
    measure_uuid: string;
    customer: {
      name: string;
    };
    measure_type: string;
    measure_value: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMeasureSelected = (measure: {
    measure_uuid: string;
    customer: {
      name: string;
    };
    measure_type: string;
    measure_value: number;
  }) => {
    setSelectedMeasure(measure);
  };

  const handleCorrectionSubmit = async (
    measure_uuid: string,
    newValue: number,
  ) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/confirm", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          measure_uuid,
          new_value: newValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Erro",
          description:
            errorData.error_description || "Falha ao confirmar a correção.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Correção confirmada com sucesso!",
        variant: "default",
      });
      setSelectedMeasure(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1">
      <div className="w-1/4">
        <RecentMeasurements
          onSelect={handleMeasureSelected}
          selectedMeasure={selectedMeasure}
        />
      </div>

      <div className="w-3/4 p-4">
        <SearchMeasurement onMeasureSelected={handleMeasureSelected} />

        {selectedMeasure && (
          <CorrectionForm
            selectedMeasure={selectedMeasure}
            onSubmit={handleCorrectionSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
