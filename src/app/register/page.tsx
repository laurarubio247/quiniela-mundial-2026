"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          display_name: name,
        });
    }

    alert("Cuenta creada correctamente 🎉");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070B21]">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-10">

        <h1 className="mb-2 text-5xl font-bold text-white">
          Crear cuenta
        </h1>

        <p className="mb-8 text-slate-400">
          Quiniela Mundial 2026
        </p>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl bg-slate-800 p-4 text-white"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-slate-800 p-4 text-white"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl bg-slate-800 p-4 text-white"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-500 py-4 text-2xl font-bold text-black hover:bg-yellow-400"
          >
            Crear cuenta
          </button>

        </form>

      </div>
    </main>
  );
}