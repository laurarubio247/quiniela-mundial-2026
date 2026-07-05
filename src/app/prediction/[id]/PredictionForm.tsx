"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  matchKickoff: string;
  manualUnlock: boolean;
};

export default function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  matchKickoff,
  manualUnlock,
}: Props) {
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [loading, setLoading] = useState(false);

  const partidoIniciado = new Date() >= new Date(matchKickoff);
  const bloqueado = partidoIniciado && !manualUnlock;

  useEffect(() => {
    cargarPrediccion();
  }, []);

  async function cargarPrediccion() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .eq("match_id", matchId)
      .maybeSingle();

    if (data) {
      setHome(String(data.home_prediction));
      setAway(String(data.away_prediction));
    }
  }

  async function guardarPronostico() {
    if (bloqueado) {
      alert("Los pronósticos para este partido ya fueron cerrados.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Debes iniciar sesión.");
      setLoading(false);
      return;
    }

    const { data: existente } = await supabase
      .from("predictions")
      .select("id")
      .eq("user_id", user.id)
      .eq("match_id", matchId)
      .maybeSingle();

    let error = null;

    if (existente) {
      const res = await supabase
        .from("predictions")
        .update({
          home_prediction: Number(home),
          away_prediction: Number(away),
        })
        .eq("id", existente.id);

      error = res.error;
    } else {
      const res = await supabase
        .from("predictions")
        .insert({
          user_id: user.id,
          match_id: matchId,
          home_prediction: Number(home),
          away_prediction: Number(away),
          points: 0,
        });

      error = res.error;
    }

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Pronóstico guardado ✅");
  }

  return (
    <div className="mt-8">

      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-semibold">
          {homeTeam}
        </span>

        <input
          type="number"
          min={0}
          value={home}
          disabled={bloqueado}
          onChange={(e) => setHome(e.target.value)}
          className="w-20 rounded-lg bg-slate-800 p-3 text-center text-2xl disabled:opacity-40"
        />
      </div>

      <div className="flex items-center justify-between mb-10">
        <span className="text-2xl font-semibold">
          {awayTeam}
        </span>

        <input
          type="number"
          min={0}
          value={away}
          disabled={bloqueado}
          onChange={(e) => setAway(e.target.value)}
          className="w-20 rounded-lg bg-slate-800 p-3 text-center text-2xl disabled:opacity-40"
        />
      </div>

      <button
        onClick={guardarPronostico}
        disabled={loading || bloqueado}
        className="w-full rounded-xl bg-yellow-500 py-4 text-xl font-bold text-black hover:bg-yellow-400 disabled:opacity-40"
      >
        {bloqueado
          ? "Pronósticos cerrados"
          : loading
          ? "Guardando..."
          : manualUnlock
          ? "Guardar pronóstico (captura excepcional)"
          : "Guardar pronóstico"}
      </button>

    </div>
  );
}