import { NextApiRequest, NextApiResponse } from "next";

interface MaterialInfo {
    descricao: string;
    pesoBruto: number;
    pesoLiquido: number;
    volume: number;
  }

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MaterialInfo>
  ) {
    // Extrair os dados enviados pelo front
    const { codigo, modeloAno } = req.body;
  
    // Aqui você integraria a chamada para a API da OpenAI
    // ou alguma lógica para buscar as informações na internet.
    // Para o exemplo, vamos retornar dados fixos (simulação):
  
    const material: MaterialInfo = {
      descricao: 'Peça Exemplo - Descrição com até 40 caracteres',
      pesoBruto: 1, // Valor padrão, se não encontrado
      pesoLiquido: 1, // Valor padrão, se não encontrado
      volume: 1, // Valor padrão, se não encontrado
    };
  
    // Retorna os dados simulados
    res.status(200).json(material);
  }