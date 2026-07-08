import { useLocation, useNavigate } from 'react-router-dom';
import { TOPICS } from '../data/topics';

const KEYS = ['A', 'B', 'C', 'D'];
const GRADES = [
  { min: 90, grade: 'S', color: '#f59e0b', label: 'Outstanding! 🏆' },
  { min: 75, grade: 'A', color: '#10b981', label: 'Excellent! 🎉' },
  { min: 60, grade: 'B', color: '#3b82f6', label: 'Good Job! 👍' },
  { min: 40, grade: 'C', color: '#f59e0b', label: 'Keep Practicing 📚' },
  { min: 0, grade: 'D', color: '#ef4444', label: 'Needs Work 💪' },
];

function getGrade(pct) {
  return GRADES.find(g => pct >= g.min) || GRADES[GRADES.length - 1];
}

function formatMathText(text) {
  if (typeof text !== 'string') return text;

  // Pre-clean LaTeX math syntax
  let s = text
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\\(|\\\)/g, '')
    .replace(/\\\[|\\\]/g, '')
    .replace(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/g, '$1/$2')
    .replace(/\\frac\s*([^{}\s]+)\s*([^{}\s]+)/g, '$1/$2')
    .replace(/\\times/g, ' × ')
    .replace(/\\cdot/g, ' × ')
    .replace(/\\le|\\leq/g, '≤')
    .replace(/\\ge|\\geq/g, '≥')
    .replace(/\\ne|\\neq/g, '≠')
    .replace(/\\phi/g, 'φ')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ')
    .replace(/\\log_\{([^}]+)\}/g, 'log_$1')
    .replace(/\\log_([a-zA-Z0-9]+)/g, 'log_$1')
    .replace(/\\/g, '');

  // Standard Unicode symbol replacements
  s = s
    .replace(/\balpha\b/g, 'α')
    .replace(/\bbeta\b/g, 'β')
    .replace(/\btheta\b/g, 'θ')
    .replace(/\bsqrt\b/g, '√')
    .replace(/ \* /g, ' × ')
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/!=/g, '≠')
    .replace(/\bpi\b/g, 'π');

  const parts = [];
  let idx = 0;
  let keyCounter = 0;
  const rx = /(?:\b(\d{1,3})\s*\/\s*(\d{1,3})\b)|(?:(log|Log|LOG)_(\d+)\(([^)]+)\))|(?:([a-zA-Z0-9αβπθ\(\)]+)\^([a-zA-Z0-9\+\-\(\)]+))|(?:([a-zA-Z]+)_(\d+)(?!\())/g;
  let m;

  while ((m = rx.exec(s)) !== null) {
    if (m.index > idx) parts.push(s.substring(idx, m.index));
    if (m[1] !== undefined && m[2] !== undefined) {
      parts.push(
        <span key={`frac-${keyCounter++}`} style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', margin: '0 0.1em' }}>
          <sup style={{ fontSize: '0.7em', verticalAlign: 'super', position: 'relative', top: '-0.15em' }}>{m[1]}</sup>
          <span style={{ fontSize: '0.9em', margin: '0 -0.02em', opacity: 0.85 }}>/</span>
          <sub style={{ fontSize: '0.7em', verticalAlign: 'sub', position: 'relative', bottom: '-0.15em' }}>{m[2]}</sub>
        </span>
      );
    } else if (m[3] !== undefined) {
      parts.push(
        <span key={`log-${keyCounter++}`}>
          log<sub style={{ fontSize: '0.75em', verticalAlign: 'sub' }}>{m[4]}</sub>({m[5]})
        </span>
      );
    } else if (m[6] !== undefined) {
      parts.push(
        <span key={`sup-${keyCounter++}`}>
          {m[6]}<sup style={{ fontSize: '0.75em', verticalAlign: 'super' }}>{m[7]}</sup>
        </span>
      );
    } else if (m[8] !== undefined) {
      parts.push(
        <span key={`sub-${keyCounter++}`}>
          {m[8]}<sub style={{ fontSize: '0.75em', verticalAlign: 'sub' }}>{m[9]}</sub>
        </span>
      );
    }
    idx = rx.lastIndex;
  }
  if (idx < s.length) parts.push(s.substring(idx));
  return parts.length > 0 ? parts : s;
}

function renderQuestionText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    const isTable = trimmed.startsWith('+') || trimmed.startsWith('|') || /^[-+|]+$/.test(trimmed);
    return (
      <div key={i} style={{
        fontFamily: isTable ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : 'inherit',
        whiteSpace: 'pre-wrap',
        background: isTable ? 'rgba(255,255,255,0.04)' : 'transparent',
        padding: isTable ? '0.1rem 0.5rem' : '0',
        letterSpacing: isTable ? '0.02em' : 'normal',
        lineHeight: isTable ? '1.35' : '1.68',
        borderRadius: isTable ? '2px' : '0'
      }}>
        {isTable ? line : formatMathText(line)}
      </div>
    );
  });
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">😕</div>
            <p>No results found. Please take a test first.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  const { questions, answers, topicId, isOverall } = state;
  const topic = isOverall ? null : TOPICS.find(t => t.id === topicId);

  const correct = questions.filter(q => answers[q.id] === q.answer).length;
  const incorrect = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.answer).length;
  const skipped = questions.filter(q => answers[q.id] === undefined).length;
  const score = Math.round((correct / questions.length) * 100);
  const gradeInfo = getGrade(score);

  // Subtopic breakdown stats
  const subtopicStats = {};
  questions.forEach(q => {
    const sub = q.subtopic || 'General';
    if (!subtopicStats[sub]) subtopicStats[sub] = { correct: 0, total: 0 };
    subtopicStats[sub].total++;
    if (answers[q.id] === q.answer) subtopicStats[sub].correct++;
  });

  const handleRetake = () => {
    if (isOverall) {
      navigate('/test/overall');
    } else {
      navigate(`/test/${topicId}`);
    }
  };

  return (
    <div className="page">
      <div className="app-bg" />
      <div className="results-wrap">
        {/* Hero Score Ring */}
        <div className="score-hero">
          <div className="score-ring" style={{ borderColor: gradeInfo.color }}>
            <span className="score-num" style={{ color: gradeInfo.color }}>{correct}</span>
            <span className="score-of">out of {questions.length}</span>
          </div>
          <div className="score-grade" style={{ color: gradeInfo.color }}>{gradeInfo.label}</div>
          <div className="score-label-text">
            {isOverall ? 'Overall Mock Test' : `${topic?.title} (🏆 TCS NQT LEVEL)`} — Score: {score}%
          </div>
          <div className="score-stats">
            <div className="score-stat">
              <div className="score-stat-val" style={{ color: '#10b981' }}>{correct}</div>
              <div className="score-stat-lbl">✅ Correct</div>
            </div>
            <div className="score-stat">
              <div className="score-stat-val" style={{ color: '#ef4444' }}>{incorrect}</div>
              <div className="score-stat-lbl">❌ Incorrect</div>
            </div>
            <div className="score-stat">
              <div className="score-stat-val" style={{ color: '#f59e0b' }}>{skipped}</div>
              <div className="score-stat-lbl">⏩ Skipped</div>
            </div>
            <div className="score-stat">
              <div className="score-stat-val" style={{ color: '#a5b4fc' }}>{score}%</div>
              <div className="score-stat-lbl">📊 Accuracy</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>🏠 Back to Dashboard</button>
          <button className="btn btn-secondary" onClick={handleRetake}>🔄 Retake Test</button>
          {!isOverall && (
            <button className="btn btn-secondary" onClick={() => navigate('/test/overall')}>⚡ Start Mock Test</button>
          )}
        </div>

        {/* Subtopic performance */}
        {Object.keys(subtopicStats).length > 1 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="section-title" style={{ marginBottom: '0.9rem' }}>📊 Subtopic Breakdown</div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              {Object.entries(subtopicStats).map(([sub, stat]) => {
                const pct = Math.round((stat.correct / stat.total) * 100);
                return (
                  <div key={sub} className="perf-row">
                    <div className="perf-lbl">
                      <span>{sub}</span>
                      <span>{stat.correct}/{stat.total} ({pct}%)</span>
                    </div>
                    <div className="perf-track">
                      <div className="perf-fill" style={{
                        width: `${pct}%`,
                        background: pct >= 70 ? 'linear-gradient(90deg,#10b981,#059669)' : pct >= 40 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#ef4444,#dc2626)'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Question Review */}
        <div>
          <div className="section-title" style={{ marginBottom: '0.9rem' }}>📝 Detailed Explanations</div>
          <div className="review-list">
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.answer;
              const isSkipped = userAns === undefined;
              let itemCls = 'review-item';
              let icon = '';
              if (isSkipped) { itemCls += ' skip'; icon = '⏩'; }
              else if (isCorrect) { itemCls += ' ok'; icon = '✅'; }
              else { itemCls += ' wrong-item'; icon = '❌'; }

              return (
                <div key={q.id} className={itemCls}>
                  <div className="review-top">
                    <span className="review-ic">{icon}</span>
                    <div>
                      <div className="review-q">
                        <strong>Q{i + 1}.</strong> {renderQuestionText(q.question)}
                      </div>
                      {isOverall && q.topicTitle && (
                        <span className="q-topic-chip" style={{ marginTop: '0.35rem', display: 'inline-flex' }}>📚 {q.topicTitle}</span>
                      )}
                    </div>
                  </div>

                  <div className="review-ans">
                    {!isSkipped && (
                      <span className={`ans-pill ${isCorrect ? 'ans-correct' : 'ans-wrong'}`}>
                        {isCorrect ? '✓' : '✗'} Your Answer: {KEYS[userAns]}. {formatMathText(q.options[userAns])}
                      </span>
                    )}
                    {!isCorrect && (
                      <span className="ans-pill ans-correct">
                        ✓ Correct Answer: {KEYS[q.answer]}. {formatMathText(q.options[q.answer])}
                      </span>
                    )}
                  </div>

                  {q.explanation && (
                    <div className="explain">
                      <div className="explain-label">💡 Explanation</div>
                      <div className="explain-text">{renderQuestionText(q.explanation)}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
