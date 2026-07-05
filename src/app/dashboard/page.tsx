"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { banderas } from "@/lib/banderas";

type Partido = {
  id: string;
  home_team: string;
  away_team: string;
  stage: string;
  kickoff: string;
  home_score: number | null;
  away_score: number | null;
  finished: boolean;
  manual_unlock: boolean;
};

type Prediction = {
  match_id: string;
  home_prediction: number;
  away_prediction: number;
  points: number;
};

export default function Dashboard() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    setIsAdmin(profile?.is_admin ?? false);

    const [{ data: matches }, { data: preds }] = await Promise.all([
      supabase
        .from("matches")
        .select("*")
        .order("kickoff"),

      supabase
        .from("predictions")
        .select("match_id, home_prediction, away_prediction, points")
        .eq("user_id", user.id),
    ]);

    setPartidos((matches ?? []) as Partido[]);
    setPredictions((preds ?? []) as Prediction[]);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#090B1F] text-white">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-6">
          <div>
            <h1 className="text-4xl font-bold">
              ⚽ Quiniela Mundial 2026
            </h1>

            <p className="text-gray-400">
              Octavos de Final
            </p>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              Inicio
            </Link>

            <Link
              href="/leaderboard"
              className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              🏆 Posiciones
            </Link>

            <Link
              href="/rules"
              className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              📖 Reglas
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400"
              >
                👑 Admin
              </Link>
            )}

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                location.href = "/login";
              }}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-500"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-8">
        {loading && <p>Cargando...</p>}

        {!loading &&
          partidos.map((partido) => {
            const prediction = predictions.find(
              (p) => p.match_id === partido.id
            );

            // El partido solo está cerrado si ya pasó la hora
            // Y el administrador NO activó "Captura abierta"
            const cerrado =
              new Date() >= new Date(partido.kickoff) &&
              !partido.manual_unlock;

            return (
              <Link
                href={`/prediction/${partido.id}`}
                key={partido.id}
              >
                <div className="mb-6 cursor-pointer rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:scale-[1.01] hover:border-yellow-400">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xl font-semibold">
                        {banderas[partido.home_team]} {partido.home_team}
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        {banderas[partido.away_team]} {partido.away_team}
                      </p>

                      {prediction ? (
                        <div className="mt-5 space-y-2">
                          <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold">
                            ✅ Pronosticado
                          </span>

                          <p className="text-lg">
                            <strong>Tu pronóstico:</strong>{" "}
                            {prediction.home_prediction} -{" "}
                            {prediction.away_prediction}
                          </p>

                          {partido.finished && (
                            <>
                              <p className="text-lg text-cyan-300">
                                <strong>Resultado:</strong>{" "}
                                {partido.home_score} - {partido.away_score}
                              </p>

                              <p
                                className={`text-xl font-bold ${
                                  prediction.points === 3
                                    ? "text-green-400"
                                    : prediction.points === 2
                                    ? "text-yellow-400"
                                    : prediction.points === 1
                                    ? "text-blue-400"
                                    : "text-red-400"
                                }`}
                              >
                                +{prediction.points} punto
                                {prediction.points === 1 ? "" : "s"}
                              </p>
                            </>
                          )}
                        </div>
                      ) : cerrado ? (
                        <div className="mt-5">
                          <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold">
                            🔒 Cerrado
                          </span>

                          {partido.finished && (
                            <p className="mt-3 text-lg text-cyan-300">
                              Resultado: {partido.home_score} -{" "}
                              {partido.away_score}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="mt-5">
                          <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-black">
                            {partido.manual_unlock
                              ? "🟢 Captura abierta"
                              : "Pendiente"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {partido.stage}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(partido.kickoff).toLocaleString("es-MX")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </main>
  );
}