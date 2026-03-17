"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { vehiclesApi } from "@/lib/vehicles-api";
import { questionsApi, answersApi } from "@/lib/questions-api";
import { Vehicle, Question } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import {
  Calendar,
  Gauge,
  Fuel,
  Palette,
  Settings,
  Phone,
  Mail,
  Share2,
  Check,
  MessageSquare,
  Send,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      vehiclesApi.getOne(id as string),
      questionsApi.getByVehicle(id as string),
    ])
      .then(async ([v, qs]) => {
        setVehicle(v);
        // Cargar la answer de cada pregunta
        const questionsWithAnswers = await Promise.all(
          qs.map(async (q) => {
            const answer = await answersApi.getByQuestion(q._id);
            return { ...q, answer: answer ?? undefined };
          }),
        );
        setQuestions(questionsWithAnswers);
      })
      .catch(() => toast.error("No se pudo cargar el vehículo"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Enlace copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setSubmitting(true);
    try {
      const q = await questionsApi.create(id as string, questionText.trim());
      setQuestions([q, ...questions]);
      setQuestionText("");
      toast.success("¡Pregunta enviada!");
    } catch {
      toast.error("Error al enviar la pregunta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = async (questionId: string, content: string) => {
    try {
      const answer = await answersApi.create(questionId, content);
      setQuestions(
        questions.map((q) => (q._id === questionId ? { ...q, answer } : q)),
      );
      toast.success("Respuesta enviada");
    } catch {
      toast.error("Error al responder");
    }
  };

  if (loading)
    return (
      <div
        className="page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );

  if (!vehicle)
    return (
      <div
        className="page container"
        style={{ paddingTop: 100, textAlign: "center" }}
      >
        <h2>Vehículo no encontrado</h2>
      </div>
    );

  const isOwner =
    user?._id ===
    (typeof vehicle.owner === "object" ? vehicle.owner._id : vehicle.owner);
  const specs = [
    { icon: Calendar, label: "Año", value: vehicle.year },
    {
      icon: Gauge,
      label: "Kilometraje",
      value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : null,
    },
    { icon: Fuel, label: "Combustible", value: vehicle.fuel },
    { icon: Settings, label: "Transmisión", value: vehicle.transmission },
    { icon: Palette, label: "Color", value: vehicle.color },
  ].filter((s) => s.value);

  return (
    <main className="page">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 32,
            alignItems: "start",
          }}
        >
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div
                style={{
                  height: 420,
                  background: vehicle.images?.[selectedImg]
                    ? `url(${vehicle.images[selectedImg]}) center/cover no-repeat`
                    : "var(--bg-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!vehicle.images?.[selectedImg] && (
                  <span style={{ color: "var(--text-3)" }}>Sin imagen</span>
                )}
              </div>
              {vehicle.images.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: 12,
                    overflowX: "auto",
                  }}
                >
                  {vehicle.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      style={{
                        width: 72,
                        height: 56,
                        flexShrink: 0,
                        borderRadius: 4,
                        background: `url(${img}) center/cover`,
                        cursor: "pointer",
                        border: `2px solid ${i === selectedImg ? "var(--amber)" : "transparent"}`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
                Descripción
              </h2>
              <p
                style={{
                  color: "var(--text-2)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {vehicle.description}
              </p>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MessageSquare size={18} style={{ color: "var(--amber)" }} />
                Preguntas ({questions.length})
              </h2>

              {user && !isOwner && (
                <form onSubmit={handleQuestion} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      className="input"
                      placeholder="Hacé tu pregunta al vendedor..."
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      maxLength={300}
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={submitting || !questionText.trim()}
                    >
                      {submitting ? (
                        <div className="spinner" />
                      ) : (
                        <Send size={15} />
                      )}
                    </button>
                  </div>
                </form>
              )}

              {!user && (
                <div
                  style={{
                    background: "var(--amber-dim2)",
                    border: "1px solid rgba(245,158,11,0.15)",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "var(--text-2)",
                    fontSize: 14,
                  }}
                >
                  <ChevronRight size={14} style={{ color: "var(--amber)" }} />
                  <Link href="/auth/login" style={{ color: "var(--amber)" }}>
                    Iniciá sesión
                  </Link>{" "}
                  para hacer preguntas al vendedor
                </div>
              )}

              {questions.length === 0 ? (
                <p style={{ color: "var(--text-3)", fontSize: 14 }}>
                  Todavía no hay preguntas para este vehículo.
                </p>
              ) : (
                <div>
                  {questions.map((q) => (
                    <QuestionItem
                      key={q._id}
                      question={q}
                      isOwner={isOwner}
                      onAnswer={handleAnswer}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ position: "sticky", top: 90 }}>
            <div className="card" style={{ padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span
                  className={`badge ${vehicle.status === "available" ? "badge-available" : "badge-sold"}`}
                >
                  {vehicle.status === "available" ? "Disponible" : "Vendido"}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={handleShare}>
                  {copied ? (
                    <Check size={15} style={{ color: "var(--success)" }} />
                  ) : (
                    <Share2 size={15} />
                  )}
                  {copied ? "Copiado" : "Compartir"}
                </button>
              </div>

              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                {vehicle.brand} {vehicle.model}
              </h1>
              <p
                style={{
                  color: "var(--text-3)",
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                {new Date(vehicle.createdAt).toLocaleDateString("es-CR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: "var(--amber)",
                  fontFamily: "var(--font-display)",
                  marginBottom: 24,
                }}
              >
                ${vehicle.price.toLocaleString()}
              </p>

              <div style={{ marginBottom: 24 }}>
                {specs.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        fontSize: 13,
                        color: "var(--text-2)",
                      }}
                    >
                      <Icon size={13} /> {label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "var(--bg-3)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-3)",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Vendedor
                </p>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>
                  {typeof vehicle.owner === "object"
                    ? vehicle.owner.name
                    : "Propietario"}
                </p>
                {typeof vehicle.owner === "object" && (
                  <>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "var(--text-2)",
                      }}
                    >
                      <Mail size={12} /> {vehicle.owner.email}
                    </p>
                    {vehicle.owner.phone && (
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          color: "var(--text-2)",
                          marginTop: 4,
                        }}
                      >
                        <Phone size={12} /> {vehicle.owner.phone}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div
                style={{
                  background: "var(--bg-3)",
                  borderRadius: 6,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-3)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {typeof window !== "undefined" ? window.location.href : ""}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleShare}
                  style={{ flexShrink: 0, fontSize: 11 }}
                >
                  {copied ? "✓" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function QuestionItem({
  question,
  isOwner,
  onAnswer,
}: {
  question: Question;
  isOwner: boolean;
  onAnswer: (id: string, c: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await onAnswer(question._id, replyText.trim());
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--bg-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text-2)",
          }}
        >
          {question.askedBy.name?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {question.askedBy.name}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-3)" }}>
              {new Date(question.createdAt).toLocaleDateString("es-CR")}
            </span>
          </div>
          <p style={{ fontSize: 14 }}>{question.content}</p>
        </div>
      </div>

      {question.answer ? (
        <div
          style={{
            marginLeft: 44,
            background: "var(--amber-dim2)",
            border: "1px solid rgba(245,158,11,0.12)",
            borderRadius: 8,
            padding: "10px 14px",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "var(--amber)",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            Respuesta del vendedor ·{" "}
            {new Date(question.answer.createdAt).toLocaleDateString("es-CR")}
          </p>
          <p style={{ fontSize: 14 }}>{question.answer.content}</p>
        </div>
      ) : isOwner ? (
        <div style={{ marginLeft: 44 }}>
          {showReply ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                placeholder="Escribí tu respuesta..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReply()}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                Responder
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowReply(false)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowReply(true)}
              style={{ fontSize: 12 }}
            >
              <Send size={12} /> Responder
            </button>
          )}
        </div>
      ) : (
        <p
          style={{
            marginLeft: 44,
            fontSize: 13,
            color: "var(--text-3)",
            fontStyle: "italic",
          }}
        >
          Aún sin respuesta
        </p>
      )}
    </div>
  );
}
