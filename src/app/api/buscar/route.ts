import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Google GenAI SDK

interface MaterialInfo {
  descricao: string;
  pesoBruto: number;
  pesoLiquido: number;
  volume: number;
}

// Função para realizar a busca no Google
async function googleSearch(query: string): Promise<any> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao buscar na API do Google: ${response.statusText}`);
  }
  const data = await response.json();

  // Log da resposta BRUTA da Google API
  //console.log("Resposta BRUTA da Google API:", JSON.stringify(data, null, 2));

  return data;
}

export async function POST(req: NextRequest) {
  try {
    const { codigo, carro } = await req.json();

    if (!codigo || !carro) {
      return NextResponse.json(
        { error: "Código da peça e modelo do carro são obrigatórios" },
        { status: 400 }
      );
    }

    // Realiza a busca no Google
    const searchQuery = `Peça ${codigo} para modelo ${carro}`;
    const searchResults = await googleSearch(searchQuery);

    // Extrai e formata os resultados desejados
    const items = searchResults.items || [];
    const resultadosFormatados = items.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }));

    // Log dos resultados FORMATADOS
    console.log(
      "Resultados FORMATADOS:",
      JSON.stringify(resultadosFormatados, null, 2)
    );

    // Cria o prompt para o Gemini
    const prompt = `
      Você é um assistente que busca informações sobre peças automotivas.
      Dados:
      - Código da peça: ${codigo}
      - Modelo do carro: ${carro}
      
      Resultados da pesquisa na web:
      ${JSON.stringify(resultadosFormatados, null, 2)}
      
      Retorne as informações mínimas para cadastro no SAP S4Hana no formato JSON:
      {
        "descricao": string,   // com até 40 caracteres,
        "pesoBruto": number,   // se não encontrado, retorne 1,
        "pesoLiquido": number, // se não encontrado, retorne 1,
        "volume": number       // se não encontrado, retorne 1
      }
    `;

    // Configura o cliente da Google GenAI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Nome correto do modelo
    });

    // Faz a chamada à Gemini API
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json", // Força resposta em JSON
      },
    });

    // Extrai e processa a resposta
    const responseText = result.response.text();
    console.log("Resposta do Gemini:", responseText); // Log da resposta do Gemini

    try {
      const material: MaterialInfo = JSON.parse(responseText);
      return NextResponse.json(material);
    } catch (error) {
      return NextResponse.json(
        { error: "Erro ao processar a resposta do Gemini" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro na chamada:", error);
    return NextResponse.json(
      { error: "Erro ao buscar informações" },
      { status: 500 }
    );
  }
}
