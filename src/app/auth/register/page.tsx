"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/auth-api";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Car } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password)
      return toast.error("Completá los campos requeridos");
    if (form.password.length < 6)
      return toast.error("La contraseña debe tener al menos 6 caracteres");

    setLoading(true);
    try {
      const { user, token } = await authApi.register(form);
      login(user, token);
      toast.success("¡Cuenta creada! Bienvenido/a");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 40% 20%, rgba(245,158,11,0.05) 0%, var(--bg) 60%)",
        padding: "80px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 40,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#f59e0b",
              borderRadius: 8,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Car size={22} color="#000" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            Tico<span style={{ color: "var(--amber)" }}>Autos</span>
          </span>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            Crear cuenta
          </h1>
          <p style={{ color: "var(--text-2)", fontSize: 14, marginBottom: 28 }}>
            Registrate gratis para publicar y comprar
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Nombre completo *</label>
              <input
                className="input"
                placeholder="Juan Pérez"
                value={form.name}
                onChange={set("name")}
                required
              />
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label className="label">Correo electrónico *</label>
              <input
                className="input"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label className="label">Contraseña *</label>
              <input
                className="input"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={set("password")}
                required
                minLength={6}
              />
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label className="label">
                Teléfono{" "}
                <span style={{ color: "var(--text-3)" }}>(opcional)</span>
              </label>
              <input
                className="input"
                placeholder="8888-8888"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>

            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", marginTop: 24 }}
            >
              {loading ? <div className="spinner" /> : "Crear cuenta"}
            </button>
          </form>

          <div className="divider" />

          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "var(--text-2)",
            }}
          >
            ¿Ya tenés cuenta?{" "}
            <Link
              href="/auth/login"
              style={{ color: "var(--amber)", fontWeight: 600 }}
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
