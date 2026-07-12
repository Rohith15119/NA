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
    .replace(/\\sqrt\s*\[([^\]]+)\]\s*\{([^}]+)\}/g, '($2)^(1/$1)')
    .replace(/\\sqrt\s*\{([^}]+)\}/g, (match, p1) => {
      return p1.includes(' ') || p1.includes('+') || p1.includes('-') || p1.includes('*') || p1.includes('/') ? `√(${p1})` : `√${p1}`;
    })
    .replace(/\\sqrt\s*([a-zA-Z0-9]+)/g, '√$1')
    .replace(/\^\{([^}]+)\}/g, (match, p1) => {
      return p1.includes(' ') || p1.includes('+') || p1.includes('-') || p1.includes('*') || p1.includes('/') ? `^(${p1})` : `^${p1}`;
    })
    .replace(/_\{([^}]+)\}/g, '_$1')
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

  // Combined regex: fractions (\d{1,3}/\d{1,3}), subscripts (base_sub), superscripts (base^sup), log_base(...)
  const rx = /(?:\b(\d{1,3})\s*\/\s*(\d{1,3})\b)|(?:(log|Log|LOG)_(\d+)\(([^)]+)\))|(?:([a-zA-Z0-9αβπθ\(\)]+)\^([a-zA-Z0-9\+\-\(\)]+))|(?:([a-zA-Z]+)_([a-zA-Z0-9\+\-\(\)]+)(?!\())/g;
  let m;

  while ((m = rx.exec(s)) !== null) {
    if (m.index > idx) parts.push(s.substring(idx, m.index));

    if (m[1] !== undefined && m[2] !== undefined) {
      // Fraction: num/den
      parts.push(
        <span key={`frac-${keyCounter++}`} style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', margin: '0 0.1em' }}>
          <sup style={{ fontSize: '0.7em', verticalAlign: 'super', position: 'relative', top: '-0.15em' }}>{m[1]}</sup>
          <span style={{ fontSize: '0.9em', margin: '0 -0.02em', opacity: 0.85 }}>/</span>
          <sub style={{ fontSize: '0.7em', verticalAlign: 'sub', position: 'relative', bottom: '-0.15em' }}>{m[2]}</sub>
        </span>
      );
    } else if (m[3] !== undefined) {
      // log_base(arg)
      parts.push(
        <span key={`log-${keyCounter++}`}>
          log<sub style={{ fontSize: '0.75em', verticalAlign: 'sub' }}>{m[4]}</sub>({m[5]})
        </span>
      );
    } else if (m[6] !== undefined) {
      // base^exp
      parts.push(
        <span key={`sup-${keyCounter++}`}>
          {m[6]}<sup style={{ fontSize: '0.75em', verticalAlign: 'super' }}>{m[7]}</sup>
        </span>
      );
    } else if (m[8] !== undefined) {
      // base_sub (e.g. P_1, a_n, a_(n-1))
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
  const rendered = [];
  let i = 0;

  const COLORS = ['#3b82f6', '#fb8c00', '#10b981', '#a855f7', '#ef4444', '#06b6d4'];

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Check if it's the start of an ASCII Table
    if (trimmed.startsWith('+') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length) {
        const currentLine = lines[i];
        const curTrimmed = currentLine.trim();
        if (curTrimmed.startsWith('+') || curTrimmed.startsWith('|')) {
          tableLines.push(currentLine);
          i++;
        } else {
          break;
        }
      }

      // Parse the gathered table lines
      const rows = [];
      tableLines.forEach(tLine => {
        const tTrimmed = tLine.trim();
        if (tTrimmed.startsWith('|')) {
          // It's a data row
          const cells = tTrimmed.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          rows.push({ isHeader: false, cells });
        }
      });

      if (rows.length > 0) {
        // Treat the first row as header
        rows[0].isHeader = true;

        rendered.push(
          <div key={`table-${i}`} style={{ margin: '1.2rem 0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '2px solid rgba(255,255,255,0.15)' }}>
                  {rows[0].cells.map((cell, cIdx) => (
                    <th key={cIdx} style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 600, textAlign: 'left', color: 'var(--text-1)' }}>
                      {formatMathText(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: rIdx % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    {row.cells.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                        {formatMathText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // 2. Check if it's the start of a Bar Chart block
    const barRegex = /^([^:\[]+):\s*\[(#+)\]\s*([0-9\s]+[a-zA-Z%]+)/;
    if (barRegex.test(trimmed)) {
      const chartItems = [];
      let maxHash = 0;

      while (i < lines.length) {
        const curLine = lines[i];
        const match = curLine.trim().match(barRegex);
        if (match) {
          const label = match[1].trim();
          const hashCount = match[2].length;
          const value = match[3].trim();
          maxHash = Math.max(maxHash, hashCount);
          chartItems.push({ label, hashCount, value });
          i++;
        } else {
          break;
        }
      }

      rendered.push(
        <div key={`barchart-${i}`} style={{
          padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.06)', margin: '1.2rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem'
        }}>
          {chartItems.map((item, idx) => {
            const barPct = maxHash > 0 ? (item.hashCount / maxHash) * 100 : 0;
            const barColor = COLORS[idx % COLORS.length];
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: '110px', minWidth: '100px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-1)' }}>
                  {item.label}
                </div>
                <div style={{ flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.06)', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${barPct}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                    height: '100%', borderRadius: '7px', transition: 'width 0.5s ease-out'
                  }} />
                </div>
                <div style={{ width: '90px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24' }}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      );
      continue;
    }

    // 3. Check if it's the start of a Pie/Segment List (bullet points with percentages)
    const pieRegex = /^-\s*([^:]+):\s*(\d+)%/;
    if (pieRegex.test(trimmed)) {
      const pieItems = [];
      while (i < lines.length) {
        const curLine = lines[i];
        const match = curLine.trim().match(pieRegex);
        if (match) {
          const label = match[1].trim();
          const percent = parseInt(match[2]);
          pieItems.push({ label, percent });
          i++;
        } else {
          break;
        }
      }

      rendered.push(
        <div key={`piechart-${i}`} style={{
          padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.06)', margin: '1.2rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem'
        }}>
          {pieItems.map((item, idx) => {
            const barColor = COLORS[idx % COLORS.length];
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '130px', minWidth: '120px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: barColor }} />
                  <span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-1)' }}>{item.label}</span>
                </div>
                <div style={{ flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.06)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.percent}%`, background: barColor,
                    height: '100%', borderRadius: '5px', transition: 'width 0.5s ease-out'
                  }} />
                </div>
                <div style={{ width: '50px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
                  {item.percent}%
                </div>
              </div>
            );
          })}
        </div>
      );
      continue;
    }

    // 4. Default: Render line as normal math-formatted text
    rendered.push(
      <div key={i} style={{
        whiteSpace: 'pre-wrap',
        letterSpacing: 'normal',
        lineHeight: '1.68',
        margin: trimmed ? '0.2rem 0' : '0.6rem 0'
      }}>
        {formatMathText(line)}
      </div>
    );
    i++;
  }

  return rendered;
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  let state = location.state;
  const queryParams = new URLSearchParams(location.search);
  const attemptId = queryParams.get('attemptId') || state?.attemptId;

  if (!state && attemptId) {
    try {
      const r = localStorage.getItem('nqt_attempts');
      if (r) {
        const attempts = JSON.parse(r);
        const found = attempts.find(a => a.id === attemptId);
        if (found) {
          state = {
            questions: found.questions,
            answers: found.answers,
            topicId: found.topicId,
            isOverall: found.isOverall,
            attemptId: found.id
          };
        }
      }
    } catch (e) {
      console.error('Failed to load attempt from localStorage:', e);
    }
  }

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
                    <div style={{ flex: 1 }}>
                      <div className="review-q">
                        <strong>Q{i + 1}.</strong> {renderQuestionText(q.question)}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem', alignItems: 'center' }}>
                        {isOverall && q.topicTitle && (
                          <span className="q-topic-chip" style={{ display: 'inline-flex' }}>📚 {q.topicTitle}</span>
                        )}
                        {q.subtopic && (
                          <span className="q-sub" style={{ display: 'inline-flex' }}>{q.subtopic}</span>
                        )}
                        {q.difficulty && (
                          <span className={`diff-badge diff-${(q.difficulty || 'Medium').toLowerCase()}`} style={{ display: 'inline-flex' }}>
                            {q.difficulty === 'Easy' ? '🟢' : q.difficulty === 'Hard' ? '🔴' : '🟡'} {q.difficulty}
                          </span>
                        )}
                      </div>
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
