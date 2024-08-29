import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center bg-gray-100 flex-1 p-6">
      <h1 className="text-4xl font-bold mb-12">SISTEMA DE MEDIÇÕES</h1>

      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <Link href="/upload">
            <Button className="w-64 mb-2">Upload de Imagem</Button>
          </Link>
          <p className="text-gray-700">
            Faça o upload de imagens dos medidores e obtenha automaticamente a
            leitura através do nosso sistema.
          </p>
        </div>

        <div className="text-center">
          <Link href="/correction">
            <Button className="w-64 mb-2">Correção de Medições</Button>
          </Link>
          <p className="text-gray-700">
            Corrija ou confirme as leituras feitas pelo sistema, garantindo a
            precisão dos dados registrados.
          </p>
        </div>

        <div className="text-center">
          <Link href="/list-measurements">
            <Button className="w-64 mb-2">Listar Medições</Button>
          </Link>
          <p className="text-gray-700">
            Visualize todas as medições realizadas, filtrando por cliente ou
            tipo de medição.
          </p>
        </div>
      </div>
    </main>
  );
}
