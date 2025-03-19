"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface MaterialInfo {
  descricao: string;
  pesoBruto: number;
  pesoLiquido: number;
  volume: number;
  // Outros campos podem ser adicionados conforme necessário
}

const Home = () => {
  const [codigo, setCodigo] = useState("");
  const [carro, setCarro] = useState("");
  const [material, setMaterial] = useState<MaterialInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);

    const response = await fetch("/api/buscar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo, carro }),
    });

    const data = await response.json();
    setMaterial(data);
    setLoading(false);
  };

  const handleCadastrar = () => {
    // Aqui você implementará a lógica de cadastro no SAP S4Hana (ou uma simulação inicial)
    console.log("Cadastrar material no SAP", material);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Busca Peças</CardTitle>
          <CardDescription>Acelerando o processo através da IA</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="peca">Código da Peça</Label>
                <Input id="peca" placeholder="Insira o código da peça"></Input>
              </div>
              <div>
                <Label htmlFor="carro">Modelo do Carro</Label>
                <Input
                  id="carro"
                  placeholder="Insira o modelo do carro"
                ></Input>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBuscar}>
            Buscar
          </Button>
          <Button>Cadastar</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
