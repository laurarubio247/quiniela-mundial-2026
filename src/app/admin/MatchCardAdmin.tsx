"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { banderas } from "@/lib/banderas";

type Props = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  manualUnlock: boolean;
  finished: boolean;
  homeScore: number | null;
  awayScore: number | null;
  onRefresh: () => void;
};

export default function MatchCardAdmin({
  id,
  homeTeam,
  awayTeam,
  kickoff,
  manualUnlock,
  finished,
  homeScore,
  awayScore,
  onRefresh,
}: Props) {
  const [home, setHome] = useState(homeScore?.toString() ?? "");
  const [away, setAway] = useState(awayScore?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  async function guardarResultado() {
    setSaving(true);

    const { error } = await supabase
      .from("matches")
      .update({
        home_score: Number(home),
        away_score: Number(away),
        finished: true,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Resultado guardado ✅");
    onRefresh();
  }

  async function toggleUnlock() {
    const { error } = await supabase
      .from("matches")
      .update({
        manual_unlock: !manualUnlock,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    onRefresh();
  }

  return (
    <div className="rounded-xl bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-2xl font-bold">
            {banderas[homeTeam]} {homeTeam}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {banderas[awayTeam]} {awayTeam}
          </p>

          <p className="mt-4 text-sm text-gray-400">
            {new Date(kickoff).toLocaleString("es-MX")}
          </p>

        </div>

        <div className="flex gap-3">

          <input
            type="number"
            min={0}
            value={home}
            onChange={(e) => setHome(e.target.value)}
            className="w-20 rounded-lg bg-slate-800 p-3 text-center text-xl"
          />

          <input
            type="number"
            min={0}
            value={away}
            onChange={(e) => setAway(e.target.value)}
            className="w-20 rounded-lg bg-slate-800 p-3 text-center text-xl"
          />

        </div>

      </div>

      <div className="mt-6 flex gap-4">

        <button
          onClick={guardarResultado}
          disabled={saving}
          className="rounded-lg bg-green-600 px-5 py-3 font-bold"
        >
          {saving ? "Guardando..." : "Guardar resultado"}
        </button>

        <button
          onClick={toggleUnlock}
          className={`rounded-lg px-5 py-3 font-bold ${
            manualUnlock
              ? "bg-yellow-500 text-black"
              : "bg-slate-700"
          }`}
        >
          {manualUnlock
            ? "Captura abierta"
            : "Captura cerrada"}
        </button>

        {finished && (
          <div className="flex items-center rounded-lg bg-blue-700 px-4 font-bold">
            Finalizado
          </div>
        )}

      </div>

    </div>
  );
}