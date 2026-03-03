'use client';

import { useEffect, useState, useCallback } from 'react';
import { vehiclesApi } from '@/lib/vehicles-api';
import { Vehicle, VehicleFilters } from '@/types';
import VehicleCard from '@/components/vehicles/VehicleCard';
import FilterBar from '@/components/vehicles/FilterBar';
import { Car } from 'lucide-react';

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState<VehicleFilters>({ page: 1, limit: 12 });
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, hasNextPage: false, hasPrevPage: false });
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async (f: VehicleFilters) => {
    setLoading(true);
    try {
      const res = await vehiclesApi.getAll(f);
      setVehicles(res.data);
      setMeta(res.meta);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles(filters);
  }, [filters, fetchVehicles]);

  const handleFilter = (newFilters: VehicleFilters) => {
    setFilters({ ...newFilters, page: 1, limit: 12 });
  };

  const handlePage = (page: number) => {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page">
      {/* Hero */}
      <section style={{
        background: `linear-gradient(180deg, #0f0f0f 0%, var(--bg) 100%)`,
        borderBottom: '1px solid var(--border)',
        padding: '56px 0 40px',
      }}>
        <div className="container">
          <p style={{ color: 'var(--amber)', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Costa Rica · {meta.total} vehículos
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 16 }}>
            Encontrá el carro<br />
            <span style={{ color: 'var(--amber)' }}>perfecto para vos</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 16, maxWidth: 520 }}>
            Explorá miles de vehículos de particulares. Filtrá por marca, modelo, precio y más.
          </p>
        </div>
      </section>

      {/* Filters */}
      <FilterBar onFilter={handleFilter} />

      {/* Results */}
      <section className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="empty fade-in">
            <Car size={48} />
            <h3>No se encontraron vehículos</h3>
            <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Intentá ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                <strong style={{ color: 'var(--text)' }}>{meta.total}</strong> resultados
                {meta.totalPages > 1 && ` · Página ${meta.page} de ${meta.totalPages}`}
              </p>
            </div>

            <div className="vehicles-grid fade-in">
              {vehicles.map((v) => (
                <VehicleCard key={v._id} vehicle={v} />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handlePage(meta.page - 1)}
                  disabled={!meta.hasPrevPage}
                >
                  ← Anterior
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - meta.page) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      className={`btn btn-sm ${p === meta.page ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handlePage(p)}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handlePage(meta.page + 1)}
                  disabled={!meta.hasNextPage}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
