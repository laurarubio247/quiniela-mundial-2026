export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">
          Familia Gómez Alvarado (y agregados)
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Quiniela Mundial 2026
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Porque en esta familia todos creen que saben de fútbol.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">

          <button className="rounded-xl bg-amber-400 px-8 py-4 font-semibold text-slate-950 transition hover:scale-105 hover:bg-amber-300">
            Iniciar sesión
          </button>

          <button className="rounded-xl border border-slate-700 px-8 py-4 font-semibold transition hover:border-amber-400 hover:bg-slate-900">
            Registrarme
          </button>

        </div>

        <div className="mt-20 grid w-full max-w-3xl gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase text-slate-400">
              Bolsa actual
            </p>

            <p className="mt-2 text-3xl font-bold">
              $0 MXN
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase text-slate-400">
              Participantes
            </p>

            <p className="mt-2 text-3xl font-bold">
              0 / 20
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase text-slate-400">
              Registro
            </p>

            <p className="mt-2 text-3xl font-bold">
              Abierto
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}