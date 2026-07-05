"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { banderas } from "@/lib/banderas";
import PredictionForm from "./PredictionForm";

type Partido = {
  id: string;
  home_team: string;
  away_team: string;
  kickoff: string;
  stage: string;
  manual_unlock: boolean;
};

export default function PredictionPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [partido, setPartido] = useState<Partido | null>(null);

  useEffect(() => {
    cargarPartido();
  }, []);

  async function cargarPartido() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setPartido(data);
  }

  if (!partido) {
    return (
      <main className="min-h-screen bg-[#090B1F] flex items-center justify-center text-white">
        Cargando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090B1F] text-white p-8">

      <button
        onClick={() => router.push("/dashboard")}
        className="mb-8 text-yellow-400 hover:text-yellow-300"
      >
        ← Regresar
      </button>

      <div className="mx-auto max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8">

        <h1 className="mb-8 text-center text-4xl font-bold">
          Tu pronóstico
        </h1>

        <div className="mb-8 rounded-xl bg-slate-800 p-6">

          <p className="mb-4 text-center text-gray-400">
            {partido.stage}
          </p>

          <div className="flex justify-between text-2xl font-bold">

            <span>
              {banderas[partido.home_team]} {partido.home_team}
            </span>

            <span>
              {banderas[partido.away_team]} {partido.away_team}
            </span>

          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            {new Date(partido.kickoff).toLocaleString("es-MX")}
          </p>

          {partido.manual_unlock && (
            <p className="mt-4 rounded-lg bg-yellow-500 p-3 text-center font-semibold text-black">
              🔓 Este partido fue abierto por el administrador para captura excepcional.
            </p>
          )}

        </div>

        <PredictionForm
          matchId={partido.id}
          homeTeam={`${banderas[partido.home_team]} ${partido.home_team}`}
          awayTeam={`${banderas[partido.away_team]} ${partido.away_team}`}
          matchKickoff={partido.kickoff}
          manualUnlock={partido.manual_unlock}
        />

      </div>

    </main>
  );
}