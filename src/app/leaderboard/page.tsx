"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Player = {
  id: string;
  display_name: string | null;
  email: string | null;
  total_points: number;
};

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarRanking();
  }, []);

  async function cargarRanking() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, email, total_points")
      .order("total_points", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPlayers((data ?? []) as Player[]);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#090B1F] text-white p-8">

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            🏆 Tabla de Posiciones
          </h1>

          <p className="mt-2 text-gray-400">
            Quiniela Mundial 2026
          </p>

        </div>

        <Link
          href="/dashboard"
          className="rounded-xl bg-slate-800 px-5 py-3 font-semibold hover:bg-slate-700"
        >
          ← Dashboard
        </Link>

      </div>

      {loading && (
        <p>Cargando...</p>
      )}

      {!loading && (

        <div className="space-y-4">

          {players.map((player, index) => (

            <div
              key={player.id}
              className="flex items-center justify-between rounded-2xl bg-slate-900 p-6"
            >

              <div className="flex items-center gap-5">

                <div className="text-4xl">

                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}

                </div>

                <div>

                  <p className="text-2xl font-bold">
                    {player.display_name || "Sin nombre"}
                  </p>

                  <p className="text-gray-400">
                    {player.email}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <p className="text-4xl font-bold text-yellow-400">
                  {player.total_points}
                </p>

                <p className="text-gray-400">
                  puntos
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
  );
}