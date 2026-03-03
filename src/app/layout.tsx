import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'TicoAutos — Compra y vende tu carro',
  description: 'Plataforma de autos en venta en Costa Rica',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#f0f0f0',
                border: '1px solid #2a2a2a',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#f59e0b', secondary: '#000' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
