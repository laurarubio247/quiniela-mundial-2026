"use client";

import Link from "next/link";

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-[#090B1F] text-white">

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-5xl items-center justify-between p-6">

          <div>

            <h1 className="text-4xl font-bold">
              📖 Reglas de la Quiniela
            </h1>

            <p className="text-gray-400">
              Mundial 2026
            </p>

          </div>

          <Link
            href="/dashboard"
            className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
          >
            ← Dashboard
          </Link>

        </div>

      </header>

      <div className="mx-auto max-w-4xl space-y-8 p-8">

        <section className="rounded-2xl bg-slate-900 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            Sistema de puntuación
          </h2>

          <div className="space-y-4">

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xl font-bold text-green-400">
                ✅ 3 puntos
              </p>
              <p>
                Acertar el marcador exacto.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xl font-bold text-yellow-400">
                ✅ 2 puntos
              </p>
              <p>
                El marcador difiere por máximo un gol en cada equipo.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xl font-bold text-blue-400">
                ✅ 1 punto
              </p>
              <p>
                Acertar únicamente el ganador del partido.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xl font-bold text-red-400">
                ❌ 0 puntos
              </p>
              <p>
                No acertar el ganador.
              </p>
            </div>

          </div>

        </section>

        <section className="rounded-2xl bg-slate-900 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            Premiación
          </h2>

          <ul className="space-y-3 text-lg">

            <li>🥇 1° lugar: <strong>70%</strong> de la bolsa.</li>

            <li>🥈 2° lugar: <strong>20%</strong> de la bolsa.</li>

            <li>🥉 3° lugar: <strong>10%</strong> de la bolsa.</li>

          </ul>

        </section>

        <section className="rounded-2xl bg-slate-900 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            Desempates
          </h2>

          <ol className="list-decimal space-y-3 pl-6 text-lg">

            <li>
              Gana quien tenga el menor error acumulado respecto a los marcadores oficiales.
            </li>

            <li>
              Si continúa el empate, gana quien haya acertado más goles del equipo ganador.
            </li>

            <li>
              Si el empate persiste al finalizar el torneo, los participantes empatados compartirán el premio correspondiente.
            </li>

          </ol>

        </section>

        <section className="rounded-2xl bg-slate-900 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            Cierre de pronósticos
          </h2>

          <p className="text-lg">
            Los pronósticos se cierran automáticamente al momento del inicio de cada partido. Solo el administrador puede habilitar una captura excepcional en casos justificados.
          </p>

        </section>

      </div>

    </main>
  );
}