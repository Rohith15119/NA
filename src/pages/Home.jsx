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

        {/* Topics Grid */}
        <div className="section-head">
          <div>
            <div className="section-title">📖 Topic-Wise Practice</div>
            <div className="section-sub">Select any topic to start practicing high-quality TCS NQT exam-level questions</div>
          </div>
        </div>
        <div className="topics-grid">
          {TOPICS.map((topic, i) => {
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                      <span className="badge badge-expert" style={{ border: 'none' }}>🏆 TCS NQT Level</span>
                      <button
                        className={`badge ${completedTopics[topic.id] ? 'badge-completed' : 'badge-pending'}`}
                        onClick={(e) => toggleCompleted(e, topic.id)}
                        style={{
                          cursor: 'pointer',
                          padding: '0.22rem 0.55rem',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          transition: 'all 0.15s ease-in-out',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {completedTopics[topic.id] ? '✅ Completed' : '⏳ Pending'}
                      </button>
                    </div>
                  </div>
                  <div className="tc-title">{topic.title}</div>
                  <div className="tc-desc">{topic.description}</div>
                  <div className="tc-tags">
                    {topic.subtopics.slice(0, 3).map(s => (
                      <span key={s} className="tc-tag">{s}</span>
                    ))}
                    {topic.subtopics.length > 3 && <span className="tc-tag">+{topic.subtopics.length - 3}</span>}
                  </div>
                  <div className="tc-meta">
                    <span className="tc-meta-item">❓ 15 Questions</span>
                    <span className="tc-meta-item">⏱️ 15 Minutes</span>
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
    </div>
  );
}
