import Link from 'next/link';
import { Vehicle } from '@/types';
import { MapPin, Gauge, Fuel, Calendar } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  showActions?: boolean;
  onEdit?: () => void;
  onSold?: () => void;
  onDelete?: () => void;
}

export default function VehicleCard({ vehicle, showActions, onEdit, onSold, onDelete }: VehicleCardProps) {
  const img = vehicle.images?.[0];

  return (
    <div className="card" style={{ transition: 'transform 0.15s, border-color 0.15s' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#333';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.borderColor = '';
      }}
    >
      {/* Image */}
      <Link href={`/vehicles/${vehicle._id}`}>
        <div style={{
          height: 200,
          background: img ? `url(${img}) center/cover no-repeat` : 'var(--bg-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {!img && (
            <span style={{ color: 'var(--text-3)', fontSize: 13 }}>Sin imagen</span>
          )}
          {/* Status badge */}
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className={`badge ${vehicle.status === 'available' ? 'badge-available' : 'badge-sold'}`}>
              {vehicle.status === 'available' ? 'Disponible' : 'Vendido'}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        <Link href={`/vehicles/${vehicle._id}`} style={{ display: 'block' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
            {vehicle.brand} {vehicle.model}
          </h3>

          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            ${vehicle.price.toLocaleString()}
          </p>

          {/* Specs row */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-2)' }}>
              <Calendar size={12} /> {vehicle.year}
            </span>
            {vehicle.mileage != null && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-2)' }}>
                <Gauge size={12} /> {vehicle.mileage.toLocaleString()} km
              </span>
            )}
            {vehicle.fuel && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-2)' }}>
                <Fuel size={12} /> {vehicle.fuel}
              </span>
            )}
            {vehicle.color && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-2)' }}>
                <MapPin size={12} /> {vehicle.color}
              </span>
            )}
          </div>
        </Link>

        {/* Owner info */}
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-3)' }}>
          Por {typeof vehicle.owner === 'object' ? vehicle.owner.name : 'Propietario'}
        </p>

        {/* Owner actions */}
        {showActions && (
          <div style={{ display: 'flex', gap: 6, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={onEdit}>Editar</button>
            {vehicle.status === 'available' && (
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={onSold}>Marcar vendido</button>
            )}
            <button className="btn btn-danger btn-sm" onClick={onDelete}>Eliminar</button>
          </div>
        )}
      </div>
    </div>
  );
}
