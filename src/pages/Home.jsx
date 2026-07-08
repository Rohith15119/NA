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

  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleStartTest = (difficulty) => {
    if (!selectedTopic) return;
    navigate(`/test/${selectedTopic.id}/${difficulty}`);
    setSelectedTopic(null);
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
            Practice 16 topics with expert-curated questions. Select your difficulty level
            (Easy, Medium, or Hard) to build complete exam proficiency.
          </p>
          <div className="hero-stats">
            <div className="stat-pill"><span className="icon">📚</span> {TOPICS.length} Topics</div>
            <div className="stat-pill"><span className="icon">❓</span> 240+ Questions</div>
            <div className="stat-pill"><span className="icon">⏱️</span> 25 min Mock Test</div>
            <div className="stat-pill"><span className="icon">🏆</span> Level Wise Practice</div>
          </div>
        </div>

        {/* Overall Test Card */}
        <div className="overall-card">
          <div className="overall-icon">🎯</div>
          <div className="overall-text">
            <h2>Full Mock Test <span className="badge badge-hard" style={{ fontSize: '0.72rem', verticalAlign: 'middle', marginLeft: '0.4rem' }}>🔴 HARD</span></h2>
            <p>20 hard-level questions from all 16 topics — simulating the <strong>actual TCS NQT difficulty</strong> to push your limits</p>
            <div className="overall-tags">
              <span className="overall-tag">⏱️ 25 minutes</span>
              <span className="overall-tag">❓ 20 Questions</span>
              <span className="overall-tag">🔴 Hard Level Only</span>
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
            <div className="section-sub">Select any topic to choose a difficulty level (Easy, Medium, Hard)</div>
          </div>
        </div>
        <div className="topics-grid">
          {TOPICS.map((topic, i) => {
            const tp = progress[topic.id];
            return (
              <div
                key={topic.id}
                className="topic-card"
                style={{
                  '--card-g': topic.gradient,
                  '--card-glow': topic.color + '33',
                  animationDelay: `${i * 0.03}s`
                }}
                onClick={() => setSelectedTopic(topic)}
              >
                <div className="tc-inner">
                  <div className="tc-top">
                    <div className="tc-icon">{topic.icon}</div>
                    <span className="badge badge-medium">Multi-Level</span>
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
                    <span className="tc-meta-item">❓ 15 Qs total</span>
                    <span className="tc-meta-item">🟢 Easy</span>
                    <span className="tc-meta-item">🟡 Med</span>
                    <span className="tc-meta-item">🔴 Hard</span>
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

        {/* Difficulty Selection Modal */}
        {selectedTopic && (
          <div className="modal-ov" onClick={() => setSelectedTopic(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{selectedTopic.icon}</span> {selectedTopic.title}
              </h3>
              <p style={{ margin: '0.4rem 0 1.2rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                Select a difficulty level to start practicing. Each test consists of 5 questions.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.4rem' }}>
                <button 
                  className="opt" 
                  onClick={() => handleStartTest('easy')}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="opt-key" style={{ background: '#10b981', borderColor: 'transparent', color: 'white' }}>E</span>
                    <strong style={{ fontSize: '0.86rem' }}>Easy Level</strong>
                  </span>
                  <span className="badge badge-easy">⏱️ 8 mins</span>
                </button>

                <button 
                  className="opt" 
                  onClick={() => handleStartTest('medium')}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="opt-key" style={{ background: '#f59e0b', borderColor: 'transparent', color: 'white' }}>M</span>
                    <strong style={{ fontSize: '0.86rem' }}>Medium Level</strong>
                  </span>
                  <span className="badge badge-medium">⏱️ 8 mins</span>
                </button>

                <button 
                  className="opt" 
                  onClick={() => handleStartTest('hard')}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="opt-key" style={{ background: '#ef4444', borderColor: 'transparent', color: 'white' }}>H</span>
                    <strong style={{ fontSize: '0.86rem' }}>Hard Level</strong>
                  </span>
                  <span className="badge badge-hard">⏱️ 10 mins</span>
                </button>
              </div>

              <div className="modal-btns">
                <button className="btn btn-secondary" onClick={() => setSelectedTopic(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
