"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface MaterialInfo {
  descricao: string;
  pesoBruto: number;
  pesoLiquido: number;
  volume: number;
}

const Home = () => {
  const [codigo, setCodigo] = useState("");
  const [carro, setCarro] = useState("");
  const [material, setMaterial] = useState<MaterialInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/buscar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo, carro }),
      });

      if (!response.ok) throw new Error("Falha na busca");

      const data = await response.json();
      setMaterial(data);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrar = () => {
    console.log("Cadastrar material:", material);
    // Adicione aqui a integração com SAP
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="flex gap-6">
        {/* Card de Busca */}
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Buscador de Peças</CardTitle>
            <CardDescription>
              Acelerando o processo através da IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="peca">Código da Peça</Label>
                  <Input
                    id="peca"
                    placeholder="Insira o código da peça"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="carro">Modelo do Carro</Label>
                  <Input
                    id="carro"
                    placeholder="Insira o modelo do carro"
                    value={carro}
                    onChange={(e) => setCarro(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleBuscar}
              disabled={loading}
              className="bg-green-500 hover:bg-green-700 mt-1.5"
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </CardFooter>
        </Card>

        {/* Card do Material (aparece apenas quando houver material) */}
        {material && (
          <Card className="w-[350px] animate-fade-in">
            <CardHeader>
              <CardTitle>Detalhes da Peça</CardTitle>
              <CardDescription>
                Informações para cadastro no sistema SAP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Descrição</Label>
                  <p className="text-sm font-medium">{material.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Peso Bruto</Label>
                    <p className="text-sm font-medium">
                      {material.pesoBruto} kg
                    </p>
                  </div>
                  <div>
                    <Label>Peso Líquido</Label>
                    <p className="text-sm font-medium">
                      {material.pesoLiquido} kg
                    </p>
                  </div>
                  <div>
                    <Label>Volume</Label>
                    <p className="text-sm font-medium">{material.volume} m³</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleCadastrar}
                className="bg-green-500 hover:bg-green-700"
              >
                Cadastrar no SAP
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;
