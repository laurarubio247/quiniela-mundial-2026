"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    const {
      data,
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN DATA:", data);
console.log("LOGIN ERROR:", error);

if (error) {
  setLoading(false);
  alert(error.message);
  return;
}

console.log("USER:", data.user);

    const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("is_admin")
  .eq("id", data.user.id)
  .single();

console.log("PROFILE:", profile);
console.log("PROFILE ERROR:", profileError);

    setLoading(false);

    if (profile?.is_admin) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }

    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#090B1F]">

      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#13182A] p-8">

        <h1 className="mb-2 text-3xl font-bold text-white">
          Iniciar sesión
        </h1>

        <p className="mb-8 text-gray-400">
          Quiniela Mundial 2026
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg bg-[#1C2238] p-3 text-white"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg bg-[#1C2238] p-3 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-500 py-3 font-bold text-black hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

      </div>

    </main>
  );
}