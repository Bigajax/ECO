"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function Home() {
  const [reflexao, setReflexao] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  async function gerarResposta() {
    if (!reflexao.trim()) return;
    setLoading(true);
    setResposta("");

    try {
      const res = await fetch("/api/gerar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensagem: reflexao }),
      });

      const data = await res.json();
      setResposta(data.resultado);
    } catch (err) {
      console.error("Erro ao gerar resposta:", err);
      setResposta("Ocorreu um erro ao gerar a resposta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-white text-4xl font-semibold mb-8 text-center"
      >
        ECO — Seu espelho interno
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-zinc-900 border-zinc-700 text-white shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <label className="text-sm mb-2 block">Escreva sua reflexão:</label>
            <Textarea
              value={reflexao}
              onChange={(e) => setReflexao(e.target.value)}
              placeholder="O que você está sentindo, pensando ou vivendo hoje?"
              className="bg-zinc-800 text-white border-zinc-600 focus-visible:ring-1 focus-visible:ring-white"
              rows={5}
            />

            <div className="flex justify-end mt-4">
              <Button
                onClick={gerarResposta}
                disabled={loading}
                className="bg-white text-black hover:bg-gray-300 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Refletir com a bolha"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {resposta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-white bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-lg"
          >
            <div className="text-sm text-zinc-400 mb-2">Reflexo da bolha:</div>
            <div className="whitespace-pre-line leading-relaxed">{resposta}</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Home;
