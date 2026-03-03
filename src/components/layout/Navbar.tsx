'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Car, LayoutDashboard, LogOut, LogIn, Plus, Inbox } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1e1e1e', height: 64,
      display: 'flex', alignItems: 'center',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: '#f59e0b', borderRadius: 6, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Car size={18} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}>
            Tico<span style={{ color: 'var(--amber)' }}>Autos</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {user ? (
            <>
              <Link href="/dashboard/my-vehicles" className="btn btn-ghost btn-sm">
                <LayoutDashboard size={15} /> Mis vehículos
              </Link>
              <Link href="/dashboard/inbox" className="btn btn-ghost btn-sm">
                <Inbox size={15} /> Inbox
              </Link>
              <Link href="/dashboard/my-vehicles?new=1" className="btn btn-primary btn-sm">
                <Plus size={15} /> Publicar
              </Link>
              <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
              <span style={{ fontSize: 13, color: 'var(--text-2)', padding: '0 8px' }}>
                {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Cerrar sesión">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">
                <LogIn size={15} /> Ingresar
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
