import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOPICS, getOverallTestQuestions, getTopicTestQuestions } from '../data/topics';
import Timer from '../components/Timer';

const KEYS = ['A', 'B', 'C', 'D'];

export default function TestPage() {
  const { topicId, difficulty } = useParams();
  const navigate = useNavigate();

  const isOverall = topicId === 'overall';
  const topic = isOverall ? null : TOPICS.find(t => t.id === topicId);

  const [questions] = useState(() => {
    if (isOverall) return getOverallTestQuestions(20);
    if (!topic) return [];
    return getTopicTestQuestions(topicId, difficulty);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const current = questions[currentIndex];

  const handleAnswer = (optionIdx) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [current.id]: optionIdx }));
  };

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
    const progressKey = isOverall ? 'overall' : `${topic.id}_${difficulty}`;
    try {
      const raw = localStorage.getItem('nqt_progress');
      let prev = {};
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            prev = parsed;
          }
        } catch {}
      }
      const best = Math.max(score, prev[progressKey]?.best || 0);
      prev[progressKey] = { best, total: questions.length, attempts: (prev[progressKey]?.attempts || 0) + 1 };
      localStorage.setItem('nqt_progress', JSON.stringify(prev));
    } catch {}
    navigate('/results', { state: { questions, answers, topicId, difficulty, isOverall } });
  }, [questions, answers, navigate, topicId, difficulty, isOverall, topic]);

  const handleTimerExpire = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // If modal is open, Enter confirms, Escape cancels
      if (showModal) {
        if (e.key === 'Enter') {
          handleSubmit();
        } else if (e.key === 'Escape') {
          setShowModal(false);
        }
        return;
      }

      if (submitted) return;

      const key = e.key.toUpperCase();
      
      // Option selection: A-D or 1-4
      if (key === 'A' || key === '1') {
        handleAnswer(0);
      } else if (key === 'B' || key === '2') {
        handleAnswer(1);
      } else if (key === 'C' || key === '3') {
        handleAnswer(2);
      } else if (key === 'D' || key === '4') {
        handleAnswer(3);
      } 
      // Prev navigation: ArrowLeft or P
      else if (e.key === 'ArrowLeft' || key === 'P') {
        if (currentIndex > 0) {
          setCurrentIndex(i => i - 1);
        }
      } 
      // Next navigation: ArrowRight or N
      else if (e.key === 'ArrowRight' || key === 'N') {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(i => i + 1);
        }
      } 
      // Submit: S
      else if (key === 'S') {
        setShowModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, submitted, handleAnswer, showModal, handleSubmit]);

  if (!questions.length) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No questions found for this topic/difficulty combination.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Back Home</button>
          </div>
        </div>
      </div>
    );
  }

  const answered = Object.keys(answers).length;
  const pct = Math.round(((currentIndex + 1) / questions.length) * 100);

  const testDuration = isOverall ? 25 : (difficulty === 'hard' ? 10 : 8);

  return (
    <div className="page" style={{ padding: 0, paddingBottom: '4rem' }}>
      <div className="app-bg" />

      {/* Test Header */}
      <div className="test-header">
        <div className="test-header-inner">
          <div className="test-info">
            <div className="test-topic">
              {isOverall ? 'Overall Mock Test' : `${topic?.title} (${difficulty?.toUpperCase()})`}
            </div>
            <div className="test-name">
              {isOverall ? '🎯 TCS NQT Mock Exam' : `📖 ${topic?.title} - ${difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1)} Test`}
            </div>
          </div>
          <div className="prog-section">
            <div className="prog-label">
              <span>Progress</span>
              <span>{currentIndex + 1} / {questions.length}</span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <Timer durationMinutes={testDuration} onExpire={handleTimerExpire} paused={submitted} />
          <button className="btn btn-danger btn-sm" onClick={() => setShowModal(true)}>
            Submit
          </button>
        </div>
      </div>

      {/* Question Area */}
      <div className="q-area">
        {/* Navigation Bubbles */}
        <div className="q-nav">
          {questions.map((q, i) => {
            let cls = 'q-bub';
            if (i === currentIndex) cls += ' current';
            else if (answers[q.id] !== undefined) cls += ' answered';
            return (
              <button key={q.id} className={cls} onClick={() => setCurrentIndex(i)}>
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="q-card">
          <div className="q-meta">
            <span className="q-num">Q{currentIndex + 1}</span>
            {current.subtopic && <span className="q-sub">{current.subtopic}</span>}
            {isOverall && current.topicTitle && (
              <span className="q-topic-chip">📚 {current.topicTitle}</span>
            )}
            <span className={`badge badge-${(current.difficulty || 'Easy').toLowerCase()}`} style={{ marginLeft: 'auto' }}>
              {current.difficulty || 'Easy'}
            </span>
          </div>

          <div className="q-text">{current.question}</div>

          <div className="options">
            {current.options.map((opt, i) => {
              const isSelected = answers[current.id] === i;
              const cls = `opt${isSelected ? ' selected' : ''}`;
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                  <span className="opt-key">{KEYS[i]}</span>
                  <span className="opt-txt">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="q-actions">
            <div className="q-act-l">
              <button className="btn btn-secondary btn-sm" disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}>
                ← Prev
              </button>
              <button className="btn btn-secondary btn-sm" disabled={currentIndex === questions.length - 1} onClick={() => setCurrentIndex(i => i + 1)}>
                Next →
              </button>
            </div>
            <div className="q-act-r">
              <div className="answered-count">
                ✅ <strong>{answered}</strong>/{questions.length} answered
              </div>
            </div>
          </div>
        </div>

        {/* Navigation bottom */}
        <div style={{ marginTop: '1.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>← Exit to Dashboard</button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>🏁 Finish & Submit</button>
          </div>
          
          <div className="shortcut-helper">
            ⌨️ <strong>Shortcuts:</strong> Option: <code>A</code>-<code>D</code> or <code>1</code>-<code>4</code> | Prev/Next: <code>←</code>/<code>→</code> or <code>P</code>/<code>N</code> | Submit: <code>S</code> then <code>Enter</code>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showModal && (
        <div className="modal-ov" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Submit Test?</h3>
            <p>
              You have answered <strong>{answered} of {questions.length}</strong> questions.
              {answered < questions.length && ` ${questions.length - answered} question(s) left unattempted.`}
              <br /><br />
              Once submitted, you will be shown the full analysis along with detailed solutions.
            </p>
            <div className="modal-btns">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Submit Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
