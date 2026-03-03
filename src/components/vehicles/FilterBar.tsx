  'use client';

  import { useState } from 'react';
  import { VehicleFilters } from '@/types';
  import { Search, SlidersHorizontal, X } from 'lucide-react';

  interface FilterBarProps {
    onFilter: (filters: VehicleFilters) => void;
  }

const BRANDS = ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Ford', 'Chevrolet', 'Volkswagen', 'Suzuki'];
const CURRENT_YEAR = new Date().getFullYear();

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [status, setStatus] = useState<'' | 'available' | 'sold'>('');

  const hasFilters = search || brand || minYear || maxYear || minPrice || maxPrice || status;

  const apply = () => {
    onFilter({
      search: search || undefined,
      brand: brand || undefined,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      status: status || undefined,
    });
  };

  const clear = () => {
    setSearch(''); setBrand(''); setMinYear(''); setMaxYear('');
    setMinPrice(''); setMaxPrice(''); setStatus('');
    onFilter({});
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') apply();
  };

  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', position: 'sticky', top: 64, zIndex: 50 }}>
      <div className="container" style={{ padding: '14px 24px' }}>
        {/* Main search row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              className="input"
              placeholder="Buscar por marca, modelo, descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKey}
              style={{ paddingLeft: 40 }}
            />
          </div>

          <button
            className={`btn btn-secondary btn-sm`}
            onClick={() => setOpen(!open)}
            style={{ gap: 6, borderColor: open ? 'var(--amber)' : undefined, color: open ? 'var(--amber)' : undefined }}
          >
            <SlidersHorizontal size={15} />
            Filtros {hasFilters ? '·' : ''}
            {hasFilters && <span className="badge badge-amber" style={{ padding: '1px 6px', fontSize: 11 }}>ON</span>}
          </button>

          <button className="btn btn-primary btn-sm" onClick={apply}>
            Buscar
          </button>

          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clear} title="Limpiar filtros">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Expanded filters panel */}
        {open && (
          <div style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}>
            {/* Brand */}
            <div className="field">
              <label className="label">Marca</label>
              <select className="input" value={brand} onChange={(e) => setBrand(e.target.value)}
                style={{ background: 'var(--bg-3)', color: brand ? 'var(--text)' : 'var(--text-3)' }}>
                <option value="">Todas</option>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Year range */}
            <div className="field">
              <label className="label">Año desde</label>
              <input className="input" type="number" placeholder="2000" min="1990" max={CURRENT_YEAR}
                value={minYear} onChange={(e) => setMinYear(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Año hasta</label>
              <input className="input" type="number" placeholder={String(CURRENT_YEAR)} min="1990" max={CURRENT_YEAR}
                value={maxYear} onChange={(e) => setMaxYear(e.target.value)} />
            </div>

            {/* Price range */}
            <div className="field">
              <label className="label">Precio mínimo ($)</label>
              <input className="input" type="number" placeholder="0" min="0"
                value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Precio máximo ($)</label>
              <input className="input" type="number" placeholder="100000" min="0"
                value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>

            {/* Status */}
            <div className="field">
              <label className="label">Estado</label>
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value as '' | 'available' | 'sold')}
                style={{ background: 'var(--bg-3)', color: status ? 'var(--text)' : 'var(--text-3)' }}>
                <option value="">Todos</option>
                <option value="available">Disponible</option>
                <option value="sold">Vendido</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
