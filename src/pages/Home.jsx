import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOPICS } from '../data/topics';

function useTopicProgress() {
  try {
    const raw = localStorage.getItem('nqt_progress');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const clean = {};
    Object.entries(parsed).forEach(([key, val]) => {
      if (val && typeof val === 'object' && typeof val.best === 'number' && typeof val.total === 'number') {
        clean[key] = val;
      }
    });
    return clean;
  } catch {
    return {};
  }
}

export default function Home() {
  const navigate = useNavigate();
  const progress = useTopicProgress();

  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('nqt_completed_topics');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleCompleted = (e, topicId) => {
    e.stopPropagation();
    setCompletedTopics(prev => {
      const updated = { ...prev, [topicId]: !prev[topicId] };
      localStorage.setItem('nqt_completed_topics', JSON.stringify(updated));
      return updated;
    });
  };

  const [attempts, setAttempts] = useState(() => {
    try {
      const saved = localStorage.getItem('nqt_attempts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const clearAttempts = () => {
    if (window.confirm("Are you sure you want to clear all attempt history? This cannot be undone.")) {
      localStorage.removeItem('nqt_attempts');
      setAttempts([]);
    }
  };

  return (
    <div className="page">
      <div className="app-bg" />
      <div className="container">
        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">
            <span /> TCS NQT 2025 • Numerical Ability Section
          </div>
          <h1>Master Numerical Ability<br />for TCS NQT</h1>
          <p>
            Practice 16 topics with expert-curated questions. Every topic is calibrated
            to the actual TCS NQT Level to build complete exam proficiency.
          </p>
          <div className="hero-stats">
            <div className="stat-pill"><span className="icon">📚</span> {TOPICS.length} Topics</div>
            <div className="stat-pill"><span className="icon">❓</span> 320+ Questions</div>
            <div className="stat-pill"><span className="icon">⏱️</span> 20 min Mock Test</div>
            <div className="stat-pill"><span className="icon">🏆</span> TCS NQT Level Practice</div>
          </div>
        </div>

        {/* Overall Test Card */}
        <div className="overall-card">
          <div className="overall-icon">🎯</div>
          <div className="overall-text">
            <h2>Full Mock Test <span className="badge badge-expert" style={{ fontSize: '0.72rem', verticalAlign: 'middle', marginLeft: '0.4rem' }}>🏆 TCS NQT LEVEL</span></h2>
            <p>20 expert-level questions from all 16 topics — simulating the <strong>actual TCS NQT difficulty</strong> to push your limits</p>
            <div className="overall-tags">
              <span className="overall-tag">⏱️ 20 minutes</span>
              <span className="overall-tag">❓ 20 Questions</span>
              <span className="overall-tag">🏆 Expert Level Only</span>
              <span className="overall-tag">📊 Detailed Review</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/test/overall')}>
            Start Mock Test →
          </button>
        </div>

        {/* Attempt History Section */}
        {attempts.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div className="section-title">📊 Attempt History</div>
                <div className="section-sub">Review your past performance, answers, and step-by-step solutions</div>
              </div>
              <button 
                onClick={clearAttempts}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#ef4444',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                Clear History
              </button>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              {attempts.slice(0, 5).map((attempt) => {
                const dateStr = new Date(attempt.timestamp).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });
                const isPass = (attempt.score / attempt.total) >= 0.6;
                
                return (
                  <div 
                    key={attempt.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '0.75rem 1rem', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255,255,255,0.04)', 
                      borderRadius: '8px',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '8px', 
                        background: attempt.isOverall ? 'linear-gradient(135deg, #f43f5e, #ec4899)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                      }}>
                        {attempt.isOverall ? '🎯' : '📝'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-1)' }}>{attempt.topicTitle}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>{dateStr}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '0.95rem', 
                          fontWeight: 700, 
                          color: isPass ? '#34d399' : '#f87171' 
                        }}>
                          {attempt.score} / {attempt.total}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: '0.1rem' }}>
                          {Math.round((attempt.score / attempt.total) * 100)}% Accuracy
                        </div>
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => navigate(`/results?attemptId=${attempt.id}`)}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Review Attempt →
                      </button>
                    </div>
                  </div>
                );
              })}
              {attempts.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/history')}
                    style={{ padding: '0.45rem 1.3rem', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    View All {attempts.length} Attempts →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Topics Grid — grouped by section */}
        {['Quantitative Aptitude', 'Logical Reasoning'].map(section => {
          const sectionTopics = TOPICS.filter(t => t.section === section);
          const sectionIcon = section === 'Quantitative Aptitude' ? '🔢' : '🧠';
          return (
            <div key={section}>
              <div className="section-head" style={{ marginTop: '2.2rem' }}>
                <div>
                  <div className="section-title">{sectionIcon} {section}</div>
                  <div className="section-sub">
                    {section === 'Quantitative Aptitude'
                      ? `${sectionTopics.length} topics — all models, variations & difficulty tiers for TCS NQT 2026`
                      : `${sectionTopics.length} topics — series, seating, coding, clocks, relations & directions`}
                  </div>
                </div>
              </div>
              <div className="topics-grid">
                {sectionTopics.map((topic, i) => {
                  const tp = progress[topic.id] || progress[`${topic.id}_expert`];
                  return (
                    <div
                      key={topic.id}
                      className="topic-card"
                      style={{
                        '--card-g': topic.gradient,
                        '--card-glow': topic.color + '33',
                        animationDelay: `${i * 0.03}s`
                      }}
                      onClick={() => navigate(`/test/${topic.id}`)}
                    >
                      <div className="tc-inner">
                        <div className="tc-top">
                          <div className="tc-icon">{topic.icon}</div>
                          <span className={`diff-badge diff-${(topic.difficulty || 'Medium').toLowerCase()}`}>
                            {topic.difficulty === 'Easy' ? '🟢' : topic.difficulty === 'Hard' ? '🔴' : '🟡'} {topic.difficulty}
                          </span>
                        </div>
                        <div className="tc-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{topic.title}</span>
                          <div
                            onClick={(e) => toggleCompleted(e, topic.id)}
                            style={{
                              width: '20px', height: '20px', borderRadius: '50%',
                              border: completedTopics[topic.id] ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.25)',
                              background: completedTopics[topic.id] ? '#10b981' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', transition: 'all 0.15s ease-in-out',
                              marginLeft: '0.5rem', flexShrink: 0
                            }}
                            title={completedTopics[topic.id] ? 'Mark as Pending' : 'Mark as Completed'}
                          >
                            {completedTopics[topic.id] && (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="tc-desc">{topic.description}</div>
                        <div className="tc-tags">
                          {topic.subtopics.slice(0, 3).map(s => (
                            <span key={s} className="tc-tag">{s}</span>
                          ))}
                          {topic.subtopics.length > 3 && <span className="tc-tag">+{topic.subtopics.length - 3} models</span>}
                        </div>
                        <div className="tc-meta">
                          <span className="tc-meta-item">❓ {topic.testSize} Q</span>
                          <span className="tc-meta-item">⏱️ {topic.duration} min</span>
                          <span className="tc-meta-item">📊 {topic.examWeight}</span>
                        </div>
                        {tp && typeof tp === 'object' && typeof tp.best === 'number' && typeof tp.total === 'number' && tp.total > 0 && (
                          <div className="tc-progress">
                            <div className="tc-prog-label">
                              <span>Best Score</span>
                              <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{tp.best}/{tp.total}</span>
                            </div>
                            <div className="tc-prog-track">
                              <div className="tc-prog-fill" style={{ width: `${(tp.best / tp.total) * 100}%`, background: topic.gradient }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
