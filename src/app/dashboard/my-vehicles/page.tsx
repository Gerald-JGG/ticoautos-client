'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { vehiclesApi } from '@/lib/vehicles-api';
import { Vehicle, CreateVehiclePayload } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleForm from '@/components/vehicles/VehicleForm';
import toast from 'react-hot-toast';
import { Plus, Car, X } from 'lucide-react';

export default function MyVehiclesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(
    searchParams.get('new') ? 'create' : null
  );
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    vehiclesApi.getMine()
      .then(setVehicles)
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async (data: CreateVehiclePayload) => {
    const v = await vehiclesApi.create(data);
    setVehicles([v, ...vehicles]);
    setFormMode(null);
    toast.success('¡Vehículo publicado!');
  };

  const handleEdit = async (data: CreateVehiclePayload) => {
    if (!editTarget) return;
    const v = await vehiclesApi.update(editTarget._id, data);
    setVehicles(vehicles.map((x) => (x._id === v._id ? v : x)));
    setFormMode(null);
    setEditTarget(null);
    toast.success('Vehículo actualizado');
  };

  const handleSold = async (id: string) => {
    if (!confirm('¿Marcar este vehículo como vendido?')) return;
    const v = await vehiclesApi.markAsSold(id);
    setVehicles(vehicles.map((x) => (x._id === id ? v : x)));
    toast.success('Marcado como vendido');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este vehículo? Esta acción no se puede deshacer.')) return;
    await vehiclesApi.remove(id);
    setVehicles(vehicles.filter((x) => x._id !== id));
    toast.success('Vehículo eliminado');
  };

  if (isLoading || loading) return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  return (
    <main className="page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Mis vehículos</h1>
            <p className="page-subtitle">{vehicles.length} publicaciones activas</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setFormMode('create'); setEditTarget(null); }}
          >
            <Plus size={16} /> Publicar vehículo
          </button>
        </div>

        {/* Form panel */}
        {formMode && (
          <div className="card fade-in" style={{ padding: 28, marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>
                {formMode === 'create' ? 'Nueva publicación' : 'Editar vehículo'}
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => { setFormMode(null); setEditTarget(null); }}>
                <X size={16} />
              </button>
            </div>
            <VehicleForm
              initial={editTarget ?? undefined}
              onSubmit={formMode === 'create' ? handleCreate : handleEdit}
              onCancel={() => { setFormMode(null); setEditTarget(null); }}
            />
          </div>
        )}

        {/* Vehicle grid */}
        {vehicles.length === 0 && !formMode ? (
          <div className="empty">
            <Car size={48} />
            <h3>Todavía no publicaste ningún vehículo</h3>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Hacé click en "Publicar vehículo" para comenzar</p>
            <button className="btn btn-primary" onClick={() => setFormMode('create')}>
              <Plus size={15} /> Publicar mi primer carro
            </button>
          </div>
        ) : (
          <div className="vehicles-grid fade-in">
            {vehicles.map((v) => (
              <VehicleCard
                key={v._id}
                vehicle={v}
                showActions
                onEdit={() => { setEditTarget(v); setFormMode('edit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onSold={() => handleSold(v._id)}
                onDelete={() => handleDelete(v._id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
