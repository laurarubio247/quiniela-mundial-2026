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
  const [penaltyWinner, setPenaltyWinner] = useState<
    "home" | "away" | null
  >(null);

  const [loading, setLoading] = useState(false);

  const partidoIniciado =
    new Date() >= new Date(matchKickoff);

  const bloqueado =
    partidoIniciado && !manualUnlock;

  useEffect(() => {
    cargarPrediccion();
  }, []);

  useEffect(() => {
    if (home !== away) {
      setPenaltyWinner(null);
    }
  }, [home, away]);

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

    if (!data) return;

    setHome(String(data.home_prediction));
    setAway(String(data.away_prediction));

    if (
      data.penalty_winner === "home" ||
      data.penalty_winner === "away"
    ) {
      setPenaltyWinner(data.penalty_winner);
    }
  }

  async function guardarPronostico() {
    if (bloqueado) {
      alert(
        "Los pronósticos para este partido ya fueron cerrados."
      );
      return;
    }

    if (
      home === away &&
      penaltyWinner === null
    ) {
      alert(
        "Selecciona quién gana en penales."
      );
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: existente } =
      await supabase
        .from("predictions")
        .select("id")
        .eq("user_id", user.id)
        .eq("match_id", matchId)
        .maybeSingle();

    let error = null;

    const payload = {
      home_prediction: Number(home),
      away_prediction: Number(away),
      penalty_winner:
        home === away
          ? penaltyWinner
          : null,
    };

    if (existente) {
      const res = await supabase
        .from("predictions")
        .update(payload)
        .eq("id", existente.id);

      error = res.error;
    } else {
      const res = await supabase
        .from("predictions")
        .insert({
          user_id: user.id,
          match_id: matchId,
          points: 0,
          ...payload,
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

      <div className="mb-6 flex items-center justify-between">

        <span className="text-2xl font-semibold">
          {homeTeam}
        </span>

        <input
          type="number"
          min={0}
          value={home}
          disabled={bloqueado}
          onChange={(e) =>
            setHome(e.target.value)
          }
          className="w-20 rounded-lg bg-slate-800 p-3 text-center text-2xl disabled:opacity-40"
        />

      </div>

      <div className="mb-8 flex items-center justify-between">

        <span className="text-2xl font-semibold">
          {awayTeam}
        </span>

        <input
          type="number"
          min={0}
          value={away}
          disabled={bloqueado}
          onChange={(e) =>
            setAway(e.target.value)
          }
          className="w-20 rounded-lg bg-slate-800 p-3 text-center text-2xl disabled:opacity-40"
        />

      </div>
            {home !== "" &&
        away !== "" &&
        Number(home) === Number(away) && (

          <div className="mb-8 rounded-xl bg-slate-800 p-5">

            <p className="mb-4 text-lg font-semibold">
              ¿Quién avanza en penales?
            </p>

            <label className="mb-3 flex cursor-pointer items-center gap-3">

              <input
                type="radio"
                name="winner"
                checked={penaltyWinner === "home"}
                onChange={() =>
                  setPenaltyWinner("home")
                }
                disabled={bloqueado}
              />

              <span className="text-lg">
                Gana {homeTeam}
              </span>

            </label>

            <label className="flex cursor-pointer items-center gap-3">

              <input
                type="radio"
                name="winner"
                checked={penaltyWinner === "away"}
                onChange={() =>
                  setPenaltyWinner("away")
                }
                disabled={bloqueado}
              />

              <span className="text-lg">
                Gana {awayTeam}
              </span>

            </label>

          </div>

      )}

      <button
        onClick={guardarPronostico}
        disabled={loading || bloqueado}
        className="w-full rounded-xl bg-yellow-500 py-4 text-xl font-bold text-black transition hover:bg-yellow-400 disabled:opacity-40"
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