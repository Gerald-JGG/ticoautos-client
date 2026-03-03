'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/auth-api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Car, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Completá todos los campos');
    setLoading(true);
    try {
      const { user, token } = await authApi.login({ email, password });
      login(user, token);
      toast.success(`¡Bienvenido, ${user.name.split(' ')[0]}!`);
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 60% 20%, rgba(245,158,11,0.05) 0%, var(--bg) 60%)',
      padding: '80px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ background: '#f59e0b', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={22} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>
            Tico<span style={{ color: 'var(--amber)' }}>Autos</span>
          </span>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Iniciá sesión</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 28 }}>Ingresá con tu cuenta para continuar</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Correo electrónico</label>
              <input
                className="input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label className="label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-3)', padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: 24 }}
            >
              {loading ? <div className="spinner" /> : 'Ingresar'}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)' }}>
            ¿No tenés cuenta?{' '}
            <Link href="/auth/register" style={{ color: 'var(--amber)', fontWeight: 600 }}>
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
