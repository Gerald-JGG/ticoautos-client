// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────
export type VehicleStatus = 'available' | 'sold';

export interface Vehicle {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  status: VehicleStatus;
  mileage?: number;
  color?: string;
  transmission?: string;
  fuel?: string;
  images: string[];
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: VehicleStatus | '';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedVehicles {
  data: Vehicle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateVehiclePayload {
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  mileage?: number;
  color?: string;
  transmission?: string;
  fuel?: string;
  images?: string[];
}

// ─── Questions & Answers ──────────────────────────────────────────────────────
export interface Answer {
  _id: string;
  content: string;
  answeredBy: User;
  createdAt: string;
}

export interface Question {
  _id: string;
  content: string;
  vehicle: Vehicle | string;
  askedBy: User;
  answer?: Answer;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  user: User;
  token: string;
}
