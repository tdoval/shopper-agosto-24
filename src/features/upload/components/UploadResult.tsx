interface UploadResultProps {
  measureValue: number | null;
  measureUuid: string | null;
}

export default function UploadResult({
  measureValue,
  measureUuid,
}: UploadResultProps) {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Resultado da Leitura</h2>
      <p>
        <strong>Valor da Medida:</strong> {measureValue}
      </p>
      <p>
        <strong>UUID da Medida:</strong> {measureUuid}
      </p>
    </div>
  );
}
