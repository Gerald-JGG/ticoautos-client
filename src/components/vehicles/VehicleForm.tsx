"use client";

import { useState } from "react";
import { CreateVehiclePayload, Vehicle } from "@/types";
import toast from "react-hot-toast";

interface VehicleFormProps {
  initial?: Vehicle;
  onSubmit: (data: CreateVehiclePayload) => Promise<void>;
  onCancel: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export default function VehicleForm({
  initial,
  onSubmit,
  onCancel,
}: VehicleFormProps) {
  const [form, setForm] = useState<CreateVehiclePayload>({
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    year: initial?.year ?? CURRENT_YEAR,
    price: initial?.price ?? 0,
    description: initial?.description ?? "",
    mileage: initial?.mileage ?? undefined,
    color: initial?.color ?? "",
    transmission: initial?.transmission ?? "",
    fuel: initial?.fuel ?? "",
    images: initial?.images ?? [],
  });
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const set =
    (field: keyof CreateVehiclePayload) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const val =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      setForm((f) => ({ ...f, [field]: val }));
    };

  const addImage = () => {
    if (imgUrl.trim() && !form.images?.includes(imgUrl.trim())) {
      setForm((f) => ({ ...f, images: [...(f.images ?? []), imgUrl.trim()] }));
      setImgUrl("");
    }
  };

  const removeImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images?.filter((i) => i !== url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand.trim()) return toast.error("La marca es requerida");
    if (!form.model.trim()) return toast.error("El modelo es requerido");
    if (!form.description || form.description.trim().length < 10)
      return toast.error("La descripción debe tener al menos 10 caracteres");
    if (form.price <= 0) return toast.error("El precio debe ser mayor a 0");
    if (form.year < 1990 || form.year > new Date().getFullYear() + 1)
      return toast.error("El año no es válido");
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const inputRow = (
    label: string,
    field: keyof CreateVehiclePayload,
    props?: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div className="field">
      <label className="label">{label}</label>
      <input
        className="input"
        {...props}
        value={(form[field] as string | number) ?? ""}
        onChange={set(field)}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {inputRow("Marca *", "brand", {
          placeholder: "Toyota",
          required: true,
        })}
        {inputRow("Modelo *", "model", {
          placeholder: "Corolla",
          required: true,
        })}
        {inputRow("Año *", "year", {
          type: "number",
          min: 1990,
          max: CURRENT_YEAR + 1,
          required: true,
        })}
        {inputRow("Precio (USD) *", "price", {
          type: "number",
          min: 0,
          required: true,
        })}
        {inputRow("Kilometraje", "mileage", {
          type: "number",
          min: 0,
          placeholder: "45000",
        })}
        {inputRow("Color", "color", { placeholder: "Blanco" })}

        <div className="field">
          <label className="label">Transmisión</label>
          <select
            className="input"
            value={form.transmission ?? ""}
            onChange={set("transmission") as any}
            style={{ background: "var(--bg-3)" }}
          >
            <option value="">Seleccionar</option>
            <option>Manual</option>
            <option>Automático</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Combustible</label>
          <select
            className="input"
            value={form.fuel ?? ""}
            onChange={set("fuel") as any}
            style={{ background: "var(--bg-3)" }}
          >
            <option value="">Seleccionar</option>
            <option>Gasolina</option>
            <option>Diésel</option>
            <option>Híbrido</option>
            <option>Eléctrico</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="field" style={{ marginTop: 16 }}>
        <label className="label">Descripción *</label>
        <textarea
          className="input"
          placeholder="Describí el estado, historial, extras del vehículo..."
          value={form.description}
          onChange={set("description") as any}
          required
          rows={4}
          minLength={10}
          style={{ resize: "vertical" }}
        />
      </div>

      {/* Images */}
      <div className="field" style={{ marginTop: 16 }}>
        <label className="label">Imágenes (URLs)</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="https://ejemplo.com/foto.jpg"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addImage())
            }
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addImage}
            style={{ flexShrink: 0 }}
          >
            Agregar
          </button>
        </div>
        {(form.images?.length ?? 0) > 0 && (
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}
          >
            {form.images!.map((url) => (
              <div
                key={url}
                style={{
                  position: "relative",
                  width: 80,
                  height: 60,
                  borderRadius: 6,
                  background: `url(${url}) center/cover`,
                  border: "1px solid var(--border)",
                }}
              >
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--danger)",
                    border: "none",
                    color: "#fff",
                    fontSize: 11,
                    lineHeight: "18px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? (
            <div className="spinner" />
          ) : initial ? (
            "Guardar cambios"
          ) : (
            "Publicar vehículo"
          )}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
