"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MatchCardAdmin from "./MatchCardAdmin";

type Profile = {
  id: string;
  display_name: string | null;
  email: string | null;
  paid: boolean | null;
  is_admin: boolean;
};

type Match = {
  id: string;
  home_team: string;
  away_team: string;
  kickoff: string;
  manual_unlock: boolean;
  finished: boolean;
  home_score: number | null;
  away_score: number | null;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);

    const { data: perfiles } = await supabase
      .from("profiles")
      .select("*")
      .order("display_name");

    const { data: partidos } = await supabase
      .from("matches")
      .select("*")
      .order("kickoff");

    setProfiles((perfiles ?? []) as Profile[]);
    setMatches((partidos ?? []) as Match[]);

    setLoading(false);
  }

  async function togglePago(
    id: string,
    pagado: boolean | null
  ) {
    await supabase
      .from("profiles")
      .update({
        paid: !pagado,
      })
      .eq("id", id);

    cargarDatos();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090B1F] flex items-center justify-center text-white text-2xl">
        Cargando panel...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090B1F] text-white">

      <div className="max-w-7xl mx-auto p-10">

        <h1 className="text-5xl font-bold mb-12">
          👑 Panel de Administración
        </h1>

        <section className="mb-16">

          <h2 className="text-3xl font-bold mb-6">
            Participantes
          </h2>

          <div className="space-y-4">

            {profiles.map((profile) => (

              <div
                key={profile.id}
                className="rounded-xl bg-slate-900 p-5 flex items-center justify-between"
              >

                <div>

                  <p className="text-xl font-bold">
                    {profile.display_name ?? "Sin nombre"}
                  </p>

                  <p className="text-gray-400">
                    {profile.email}
                  </p>

                  {profile.is_admin && (
                    <p className="text-yellow-400 mt-1">
                      Administrador
                    </p>
                  )}

                </div>

                <button
                  onClick={() =>
                    togglePago(profile.id, profile.paid)
                  }
                  className={`rounded-lg px-5 py-3 font-bold ${
                    profile.paid
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {profile.paid
                    ? "Pagó"
                    : "No pagó"}
                </button>

              </div>

            ))}

          </div>

        </section>

        <section>

          <h2 className="text-3xl font-bold mb-6">
            Partidos
          </h2>

          <div className="space-y-6">

            {matches.map((match) => (

              <MatchCardAdmin
                key={match.id}
                id={match.id}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                kickoff={match.kickoff}
                manualUnlock={match.manual_unlock}
                finished={match.finished}
                homeScore={match.home_score}
                awayScore={match.away_score}
                onRefresh={cargarDatos}
              />

            ))}

          </div>

        </section>

      </div>

    </main>
  );
}