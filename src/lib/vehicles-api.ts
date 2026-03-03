import api from '@/lib/api';
import { PaginatedVehicles, Vehicle, VehicleFilters, CreateVehiclePayload } from '@/types';

export const vehiclesApi = {
  // ── Public ───────────────────────────────────────────────────────────────────
  getAll: async (filters: VehicleFilters = {}): Promise<PaginatedVehicles> => {
    // Remove empty string / undefined filters before sending
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined),
    );
    const res = await api.get('/vehicles', { params });
    return res.data;
  },

  getOne: async (id: string): Promise<Vehicle> => {
    const res = await api.get(`/vehicles/${id}`);
    return res.data;
  },

  // ── Authenticated ─────────────────────────────────────────────────────────────
  getMine: async (): Promise<Vehicle[]> => {
    const res = await api.get('/vehicles/my');
    return res.data;
  },

  create: async (data: CreateVehiclePayload): Promise<Vehicle> => {
    const res = await api.post('/vehicles', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateVehiclePayload>): Promise<Vehicle> => {
    const res = await api.put(`/vehicles/${id}`, data);
    return res.data;
  },

  markAsSold: async (id: string): Promise<Vehicle> => {
    const res = await api.patch(`/vehicles/${id}/sold`);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};
