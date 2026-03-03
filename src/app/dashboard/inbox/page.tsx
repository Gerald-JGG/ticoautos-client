'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questionsApi, answersApi } from '@/lib/questions-api';
import { Question, Vehicle } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Inbox, MessageSquare, Send, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function InboxPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'inbox' | 'mine'>('inbox');
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([questionsApi.getInbox(), questionsApi.getMine()])
      .then(([inbox, mine]) => { setQuestions(inbox); setMyQuestions(mine); })
      .finally(() => setLoading(false));
  }, [user]);

  const handleAnswer = async (questionId: string) => {
    const content = replyMap[questionId]?.trim();
    if (!content) return;
    try {
      const answer = await answersApi.create(questionId, content);
      setQuestions(questions.map((q) => q._id === questionId ? { ...q, answer } : q));
      setReplyMap((m) => ({ ...m, [questionId]: '' }));
      setReplyOpen((m) => ({ ...m, [questionId]: false }));
      toast.success('Respuesta enviada');
    } catch {
      toast.error('Error al responder');
    }
  };

  const activeList = tab === 'inbox' ? questions : myQuestions;
  const unanswered = questions.filter((q) => !q.answer).length;

  if (isLoading || loading) return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Inbox size={32} style={{ color: 'var(--amber)' }} />
            Mensajes
          </h1>
          <p className="page-subtitle">
            {unanswered > 0
              ? `Tenés ${unanswered} pregunta${unanswered > 1 ? 's' : ''} sin responder`
              : 'Todo al día 👍'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {[
            { key: 'inbox', label: 'Preguntas recibidas', count: questions.length },
            { key: 'mine', label: 'Mis preguntas', count: myQuestions.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key as 'inbox' | 'mine')}
              style={{
                background: 'none', border: 'none', padding: '10px 16px',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                color: tab === key ? 'var(--amber)' : 'var(--text-2)',
                borderBottom: tab === key ? '2px solid var(--amber)' : '2px solid transparent',
                marginBottom: -1,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {label}
              <span className={`badge ${tab === key ? 'badge-amber' : ''}`} style={{ padding: '1px 7px', fontSize: 11 }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {activeList.length === 0 ? (
          <div className="empty">
            <MessageSquare size={48} />
            <h3>{tab === 'inbox' ? 'No hay preguntas recibidas' : 'No has hecho preguntas aún'}</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeList.map((q) => {
              const v = q.vehicle as Vehicle;
              return (
                <div key={q._id} className="card fade-in" style={{ padding: '20px 24px' }}>
                  {/* Vehicle ref */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <Link href={`/vehicles/${typeof v === 'object' ? v._id : v}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)' }}>
                      <ExternalLink size={12} />
                      {typeof v === 'object' ? `${v.brand} ${v.model} ${v.year}` : 'Ver vehículo'}
                    </Link>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {new Date(q.createdAt).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Question */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, flexShrink: 0,
                    }}>
                      {q.askedBy.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{q.askedBy.name}</p>
                      <p style={{ fontSize: 15 }}>{q.content}</p>
                    </div>
                  </div>

                  {/* Answer or reply form */}
                  {q.answer ? (
                    <div style={{
                      marginLeft: 48, background: 'var(--amber-dim2)', border: '1px solid rgba(245,158,11,0.12)',
                      borderRadius: 8, padding: '10px 14px',
                    }}>
                      <p style={{ fontSize: 12, color: 'var(--amber)', marginBottom: 4, fontWeight: 600 }}>
                        Respuesta · {new Date(q.answer.createdAt).toLocaleDateString('es-CR')}
                      </p>
                      <p style={{ fontSize: 14 }}>{q.answer.content}</p>
                    </div>
                  ) : tab === 'inbox' ? (
                    <div style={{ marginLeft: 48 }}>
                      {replyOpen[q._id] ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            className="input"
                            placeholder="Escribí tu respuesta..."
                            value={replyMap[q._id] ?? ''}
                            onChange={(e) => setReplyMap((m) => ({ ...m, [q._id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnswer(q._id)}
                          />
                          <button className="btn btn-primary btn-sm" onClick={() => handleAnswer(q._id)}>
                            <Send size={13} />
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setReplyOpen((m) => ({ ...m, [q._id]: false }))}>
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setReplyOpen((m) => ({ ...m, [q._id]: true }))}
                          style={{ borderColor: 'rgba(245,158,11,0.3)', color: 'var(--amber)' }}
                        >
                          <Send size={13} /> Responder
                        </button>
                      )}
                    </div>
                  ) : (
                    <p style={{ marginLeft: 48, fontSize: 13, color: 'var(--text-3)', fontStyle: 'italic' }}>
                      Pendiente de respuesta
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
