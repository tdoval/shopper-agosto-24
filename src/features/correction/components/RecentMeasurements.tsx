"use client";

import { useEffect, useState } from "react";

interface Measurement {
  measure_uuid: string;
  customer: {
    name: string;
  };
  measure_type: string;
  measure_value: number;
}

interface RecentMeasurementsProps {
  onSelect: (measure: Measurement) => void;
  selectedMeasure: Measurement | null;
}

export default function RecentMeasurements({
  onSelect,
  selectedMeasure,
}: RecentMeasurementsProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    async function fetchMeasurements() {
      const response = await fetch("/api/measurements?limit=10");
      const data = await response.json();
      setMeasurements(data.measurements);
    }

    fetchMeasurements();
  }, []);

  return (
    <div className="bg-gray-100 p-4 border-r min-h-full flex flex-col flex-1">
      <h2 className="text-lg font-semibold mb-4">Últimas Leituras</h2>
      <ul>
        {measurements.map((measure) => (
          <li
            key={measure.measure_uuid}
            className={`p-2 cursor-pointer hover:bg-gray-200 rounded ${
              selectedMeasure?.measure_uuid === measure.measure_uuid
                ? "bg-gray-300"
                : ""
            }`}
            onClick={() => onSelect(measure)}
          >
            <p>
              <strong>Cliente:</strong> {measure.customer.name}
            </p>
            <p>
              <strong>Tipo:</strong> {measure.measure_type}
            </p>
            <p>
              <strong>Valor:</strong> {measure.measure_value}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
