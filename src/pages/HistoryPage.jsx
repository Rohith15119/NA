import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState(() => {
    try {
      const saved = localStorage.getItem('nqt_attempts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'mock', 'topic'

  const deleteAttempt = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this test attempt from history?")) {
      const updated = attempts.filter(a => a.id !== id);
      localStorage.setItem('nqt_attempts', JSON.stringify(updated));
      setAttempts(updated);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear ALL attempt history? This cannot be undone.")) {
      localStorage.removeItem('nqt_attempts');
      setAttempts([]);
    }
  };

  // Filtered attempts
  const filteredAttempts = attempts.filter(a => {
    const matchesSearch = a.topicTitle.toLowerCase().includes(search.toLowerCase());
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'mock' && a.isOverall) || 
      (filterType === 'topic' && !a.isOverall);
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const totalAttempts = attempts.length;
  const avgAccuracy = totalAttempts > 0 
    ? Math.round((attempts.reduce((sum, a) => sum + (a.score / a.total), 0) / totalAttempts) * 100)
    : 0;
  const passAttempts = attempts.filter(a => (a.score / a.total) >= 0.6).length;
  const passRate = totalAttempts > 0 ? Math.round((passAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="page">
      <div className="app-bg" />
      <div className="container">
        
        {/* Header */}
        <div className="hero" style={{ padding: '2.5rem 2rem', marginBottom: '2rem' }}>
          <div className="hero-badge">
            <span /> Attempt History & Analytics
          </div>
          <h1>Review Your Performance</h1>
          <p>
            Track your progress across numerical ability topics. Analyze previous questions,
            review your answers, and learn from step-by-step explanations.
          </p>
        </div>

        {/* Stats Grid */}
        {totalAttempts > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Total Tests Taken</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-1)' }}>{totalAttempts}</div>
            </div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Average Accuracy</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6' }}>{avgAccuracy}%</div>
            </div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>TCS Pass Rate (≥60%)</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>{passRate}%</div>
            </div>
          </div>
        )}

        {/* Controls Section */}
        {totalAttempts > 0 ? (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {/* Search & Filter */}
              <div style={{ display: 'flex', gap: '0.85rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search by topic name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    color: 'var(--text-1)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    minWidth: '220px',
                    flex: 1
                  }}
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    color: 'var(--text-1)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all" style={{ background: '#1c1c1e' }}>All Types</option>
                  <option value="mock" style={{ background: '#1c1c1e' }}>Full Mock Tests</option>
                  <option value="topic" style={{ background: '#1c1c1e' }}>Topic Tests</option>
                </select>
              </div>

              {/* Clear History Button */}
              <button 
                onClick={clearHistory}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#ef4444',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                Clear All History
              </button>
            </div>

            {/* List */}
            {filteredAttempts.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '3rem'
              }}>
                {filteredAttempts.map((attempt) => {
                  const dateStr = new Date(attempt.timestamp).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });
                  const accuracy = Math.round((attempt.score / attempt.total) * 100);
                  const isPass = accuracy >= 60;

                  return (
                    <div 
                      key={attempt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '10px',
                        flexWrap: 'wrap',
                        gap: '1.2rem',
                        transition: 'transform 0.15s ease, background 0.15s ease'
                      }}
                      className="history-row"
                    >
                      {/* Left: Icon & Title */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: attempt.isOverall ? 'linear-gradient(135deg, #f43f5e, #ec4899)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem'
                        }}>
                          {attempt.isOverall ? '🎯' : '📝'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-1)' }}>
                            {attempt.topicTitle}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>
                            📅 {dateStr}
                          </div>
                        </div>
                      </div>

                      {/* Right: Scores & Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {/* Score details */}
                        <div style={{ textAlign: 'right', minWidth: '90px' }}>
                          <div style={{ 
                            fontSize: '1.05rem', 
                            fontWeight: 800, 
                            color: isPass ? '#10b981' : '#ef4444' 
                          }}>
                            {attempt.score} / {attempt.total}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>
                            {accuracy}% Accuracy
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/results?attemptId=${attempt.id}`)}
                            style={{ padding: '0.5rem 1.1rem', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            Review Questions 🔍
                          </button>
                          
                          <button
                            onClick={(e) => deleteAttempt(e, attempt.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.08)',
                              border: '1px solid rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            title="Delete attempt"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '3rem 2rem' }}>
                <div className="empty-icon">🔍</div>
                <p style={{ color: 'var(--text-2)' }}>No results match your search or filter.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '4rem 2rem' }}>
            <div className="empty-icon">📊</div>
            <h2>No History Found</h2>
            <p style={{ color: 'var(--text-3)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
              You haven't completed any topic tests or mock tests yet. Take a test to start tracking your performance.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/test/overall')}>
              Take Full Mock Test ⚡
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
