import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOPICS, getOverallTestQuestions, getTopicTestQuestions } from '../data/topics';
import { generateAIQuestions, generateAIOverallQuestions } from '../services/geminiService';
import Timer from '../components/Timer';

const KEYS = ['A', 'B', 'C', 'D'];

// Batch sizes for paginated loading
const TOPIC_INITIAL   = 5;   // show quickly, user starts immediately
const TOPIC_TOTAL     = 15;
const OVERALL_INITIAL = 8;
const OVERALL_TOTAL   = 20;

function capFirst(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
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

  // Combined regex: fractions (\d{1,3}/\d{1,3}), subscripts (base_sub), superscripts (base^sup), log_base(...)
  const rx = /(?:\b(\d{1,3})\s*\/\s*(\d{1,3})\b)|(?:(log|Log|LOG)_(\d+)\(([^)]+)\))|(?:([a-zA-Z0-9αβπθ\(\)]+)\^([a-zA-Z0-9\+\-\(\)]+))|(?:([a-zA-Z]+)_(\d+)(?!\())/g;
  let m;

  while ((m = rx.exec(s)) !== null) {
    if (m.index > idx) parts.push(s.substring(idx, m.index));

    if (m[1] !== undefined && m[2] !== undefined) {
      // Fraction: num/den → styled inline diagonal fraction to preserve line height
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
      // base_sub (e.g. P_1, a_n)
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

function validateAIQuestions(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(q => {
    if (!q || typeof q.question !== 'string' || !q.question.trim()) return false;
    if (!Array.isArray(q.options) || q.options.length < 4) return false;
    
    const uniq = new Set(q.options.map(o => String(o).trim().toLowerCase()));
    if (uniq.size < 4) return false;

    for (let opt of q.options) {
      const s = String(opt).toLowerCase().trim();
      if (!s || s.includes('nan') || s.includes('null') || s.includes('undefined')) return false;
    }

    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) return false;
    return true;
  });
}

export default function TestPage() {
  const { topicId } = useParams();
  const difficulty = 'expert';
  const navigate   = useNavigate();
  const cancelRef  = useRef(false);

  const isOverall  = topicId === 'overall';
  const topic      = isOverall ? null : TOPICS.find(t => t.id === topicId);

  // ── Question loading state ─────────────────────────────────────────────────
  const [questions,       setQuestions]       = useState([]);
  const [totalExpected,   setTotalExpected]   = useState(TOPIC_TOTAL);
  const [isInitialLoad,   setIsInitialLoad]   = useState(true);
  const [isLoadingMore,   setIsLoadingMore]   = useState(false);
  const [aiPowered,       setAiPowered]       = useState(false);
  const [loadError,       setLoadError]       = useState('');

  // ── Test state ─────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers,      setAnswers]      = useState({});
  const [submitted,    setSubmitted]    = useState(false);
  const [showModal,    setShowModal]    = useState(false);

  // ── Paginated AI question loading ──────────────────────────────────────────
  useEffect(() => {
    cancelRef.current = false;

    const total    = isOverall ? OVERALL_TOTAL : TOPIC_TOTAL;
    const initSize = isOverall ? OVERALL_INITIAL : TOPIC_INITIAL;
    setTotalExpected(total);

    async function load() {
      setIsInitialLoad(true);
      setLoadError('');

      // ── BATCH 1: load quickly so user can start immediately ──────────────
      try {
        const rawBatch1 = isOverall
          ? await generateAIOverallQuestions(initSize, [])
          : await generateAIQuestions(topicId, difficulty, initSize, [], 0);
        
        const batch1 = validateAIQuestions(rawBatch1);

        if (cancelRef.current) return;

        if (batch1 && batch1.length > 0) {
          setQuestions(batch1);
          setAiPowered(true);
          setIsInitialLoad(false);
          setIsLoadingMore(true);

          // ── BATCH 2: load remaining in background ──────────────────────
          const remaining   = total - batch1.length;
          const usedTexts   = batch1.map(q => q.question);

          try {
            const rawBatch2 = isOverall
              ? await generateAIOverallQuestions(remaining, usedTexts)
              : await generateAIQuestions(topicId, difficulty, remaining, usedTexts, batch1.length);
            
            const batch2 = validateAIQuestions(rawBatch2);

            if (!cancelRef.current) {
              setQuestions(prev => {
                const ids = new Set(prev.map(q => q.id));
                const filteredBatch2 = batch2.filter(q => !ids.has(q.id));
                const combined = [...prev, ...filteredBatch2];
                
                if (combined.length < total) {
                  const staticAll = isOverall
                    ? getOverallTestQuestions(total)
                    : getTopicTestQuestions(topicId, total);
                  const needed = total - combined.length;
                  const staticSlice = staticAll.filter(q => !ids.has(q.id) && !filteredBatch2.some(b => b.question === q.question)).slice(0, needed);
                  return [...combined, ...staticSlice];
                }
                return combined.slice(0, total);
              });
            }
          } catch (e2) {
            console.warn('[AI Batch 2 failed] falling back to static for remaining:', e2.message);
            // Fill remaining slots with static questions
            const staticAll = isOverall
              ? getOverallTestQuestions(total)
              : getTopicTestQuestions(topicId, total);
            const staticSlice = staticAll.slice(batch1.length, total);
            if (!cancelRef.current && staticSlice.length > 0) {
              setQuestions(prev => {
                const ids = new Set(prev.map(q => q.id));
                return [...prev, ...staticSlice.filter(q => !ids.has(q.id))];
              });
            }
          } finally {
            if (!cancelRef.current) setIsLoadingMore(false);
          }
          return;
        }
      } catch (e1) {
        console.warn('[AI Batch 1 failed] falling back to full static pool:', e1.message);
      }

      // ── FULL STATIC FALLBACK ─────────────────────────────────────────────
      if (!cancelRef.current) {
        try {
          const staticQs = isOverall
            ? getOverallTestQuestions(total)
            : getTopicTestQuestions(topicId, total);
          if (staticQs && staticQs.length > 0) {
            setQuestions(staticQs);
            setAiPowered(false);
          } else {
            setLoadError('Could not generate questions. Please go back and try again.');
          }
        } catch {
          setLoadError('Failed to load questions. Please go back and retry.');
        }
        setIsInitialLoad(false);
        setIsLoadingMore(false);
      }
    }

    load();
    return () => { cancelRef.current = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fullscreen Mode ────────────────────────────────────────────────────────
  useEffect(() => {
    const enterFS = async () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen entry denied:', err.message);
      }
    };

    enterFS();

    return () => {
      try {
        if (document.fullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      } catch (err) {
        console.warn('Fullscreen exit failed:', err.message);
      }
    };
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const current      = questions[currentIndex] || null;
  const answered     = Object.keys(answers).length;
  const pct          = Math.round(((currentIndex + 1) / Math.max(totalExpected, 1)) * 100);
  const testDuration = totalExpected;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAnswer = useCallback((optIdx) => {
    if (submitted || !current) return;
    setAnswers(a => ({ ...a, [current.id]: optIdx }));
  }, [submitted, current]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    const score = questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0
    );
    const key = isOverall ? 'overall' : topic?.id;
    const attemptId = `attempt_${Date.now()}`;

    try {
      let prev = {};
      try { const r = localStorage.getItem('nqt_progress'); if (r) { const p = JSON.parse(r); if (p && typeof p === 'object') prev = p; } } catch {}
      prev[key] = { best: Math.max(score, prev[key]?.best || 0), total: questions.length, attempts: (prev[key]?.attempts || 0) + 1 };
      localStorage.setItem('nqt_progress', JSON.stringify(prev));
    } catch {}

    try {
      let attempts = [];
      try {
        const r = localStorage.getItem('nqt_attempts');
        if (r) {
          const parsed = JSON.parse(r);
          if (Array.isArray(parsed)) attempts = parsed;
        }
      } catch {}
      
      const newAttempt = {
        id: attemptId,
        timestamp: Date.now(),
        topicId: isOverall ? 'overall' : topicId,
        topicTitle: isOverall ? 'Full Mock Test' : (topic?.title || 'Topic Test'),
        isOverall,
        score,
        total: questions.length,
        questions,
        answers
      };
      
      attempts.unshift(newAttempt);
      if (attempts.length > 30) attempts = attempts.slice(0, 30);
      localStorage.setItem('nqt_attempts', JSON.stringify(attempts));
    } catch (e) {
      console.error('Failed to save attempt history:', e);
    }

    navigate(`/results?attemptId=${attemptId}`, { state: { questions, answers, topicId, isOverall, attemptId } });
  }, [submitted, questions, answers, navigate, topicId, isOverall, topic]);

  const handleTimerExpire = useCallback(() => handleSubmit(), [handleSubmit]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (isInitialLoad) return;
      if (showModal) {
        if (e.key === 'Enter')  { handleSubmit(); return; }
        if (e.key === 'Escape') { setShowModal(false); return; }
        return;
      }
      if (submitted) return;
      const k = e.key.toUpperCase();
      if      (k === 'A' || k === '1') handleAnswer(0);
      else if (k === 'B' || k === '2') handleAnswer(1);
      else if (k === 'C' || k === '3') handleAnswer(2);
      else if (k === 'D' || k === '4') handleAnswer(3);
      else if (e.key === 'ArrowLeft'  || k === 'P') { if (currentIndex > 0)                    setCurrentIndex(i => i - 1); }
      else if (e.key === 'ArrowRight' || k === 'N') { if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1); }
      else if (k === 'S') setShowModal(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isInitialLoad, showModal, submitted, currentIndex, questions.length, handleAnswer, handleSubmit]);

  // ── Initial Loading Screen ────────────────────────────────────────────────
  if (isInitialLoad) {
    return (
      <div className="page">
        <div className="app-bg" />
        <div className="ai-loading-screen">
          <div className="ai-spinner-ring" />
          <div className="ai-loading-title">🤖 Generating Questions with Gemini AI</div>
          <div className="ai-loading-sub">
            {isOverall
              ? 'Creating hard-level questions across all 16 topics…'
              : `Crafting fresh ${capFirst(difficulty)}-difficulty questions for ${topic?.title || 'this topic'}…`}
          </div>
          <div className="ai-badge">✨ Powered by Gemini 2.0 Flash</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-2)', marginTop: '0.3rem' }}>
            First {isOverall ? OVERALL_INITIAL : TOPIC_INITIAL} questions loading — you can start in seconds!
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <p>{loadError}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Back Home</button>
        </div>
      </div></div>
    );
  }

  // ── Empty questions ───────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>No questions found. Please go back and try again.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Back Home</button>
        </div>
      </div></div>
    );
  }

  // ── Main Test UI ──────────────────────────────────────────────────────────
  return (
    <div className="page" style={{ padding: 0, paddingBottom: '4rem' }}>
      <div className="app-bg" />

      {/* Header */}
      <div className="test-header">
        <div className="test-header-inner">
          <div className="test-info">
            <div className="test-topic">
              {isOverall ? 'Overall Mock Test' : `${topic?.title} (🏆 TCS NQT LEVEL)`}
            </div>
            <div className="test-name">
              {isOverall ? '🎯 TCS NQT Mock Exam' : `📖 ${topic?.title} — 🏆 TCS NQT Level Test`}
              {aiPowered && <span className="ai-live-badge">🤖 AI</span>}
            </div>
          </div>
          <div className="prog-section">
            <div className="prog-label">
              <span>Progress</span>
              <span>{currentIndex + 1} / {totalExpected}</span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <Timer durationMinutes={testDuration} onExpire={handleTimerExpire} paused={submitted} />
          <button className="btn btn-danger btn-sm" onClick={() => setShowModal(true)}>Submit</button>
        </div>
      </div>

      {/* Question area */}
      <div className="q-area">

        {/* Question bubbles */}
        <div className="q-nav">
          {questions.map((q, i) => {
            let cls = 'q-bub';
            if (i === currentIndex)              cls += ' current';
            else if (answers[q.id] !== undefined) cls += ' answered';
            return (
              <button key={q.id} className={cls} onClick={() => setCurrentIndex(i)}>{i + 1}</button>
            );
          })}
          {/* Skeleton placeholders for AI batch 2 still loading */}
          {isLoadingMore && Array.from({ length: totalExpected - questions.length }).map((_, i) => (
            <button key={`sk-${i}`} className="q-bub skeleton" disabled title="Generating…">
              {questions.length + i + 1}
            </button>
          ))}
        </div>

        {/* Loading-more indicator */}
        {isLoadingMore && (
          <div className="loading-more-banner">
            <div className="loading-more-dot" />
            <div className="loading-more-dot" />
            <div className="loading-more-dot" />
            <span>Generating {totalExpected - questions.length} more questions in background…</span>
          </div>
        )}

        {/* Question card */}
        {current ? (
          <div className="q-card">
            <div className="q-meta">
              <span className="q-num">Q{currentIndex + 1}</span>
              {current.subtopic && <span className="q-sub">{current.subtopic}</span>}
              {isOverall && current.topicTitle && (
                <span className="q-topic-chip">📚 {current.topicTitle}</span>
              )}
              <span className="badge badge-expert" style={{ marginLeft: 'auto' }}>
                TCS NQT Level
              </span>
            </div>

            <div className="q-text">{renderQuestionText(current.question)}</div>

            <div className="options">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  className={`opt${answers[current.id] === i ? ' selected' : ''}`}
                  onClick={() => handleAnswer(i)}
                >
                  <span className="opt-key">{KEYS[i]}</span>
                  <span className="opt-txt">{formatMathText(opt)}</span>
                </button>
              ))}
            </div>

            <div className="q-actions">
              <div className="q-act-l">
                <button className="btn btn-secondary btn-sm" disabled={currentIndex === 0}                    onClick={() => setCurrentIndex(i => i - 1)}>← Prev</button>
                <button className="btn btn-secondary btn-sm" disabled={currentIndex >= questions.length - 1} onClick={() => setCurrentIndex(i => i + 1)}>Next →</button>
              </div>
              <div className="q-act-r">
                <div className="answered-count">✅ <strong>{answered}</strong>/{questions.length} answered</div>
              </div>
            </div>
          </div>
        ) : (
          /* User clicked a skeleton bubble that isn't loaded yet */
          <div className="q-card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-2)' }}>
            <div className="ai-spinner-ring" style={{ margin: '0 auto 1.2rem' }} />
            <p style={{ fontWeight: 600 }}>This question is still being generated…</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Go back and answer earlier questions while AI finishes.
            </p>
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ marginTop: '1.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>← Exit to Dashboard</button>
            <button className="btn btn-primary"   onClick={() => setShowModal(true)}>🏁 Finish &amp; Submit</button>
          </div>
          <div className="shortcut-helper">
            ⌨️ <strong>Shortcuts:</strong> Option: <code>A</code>–<code>D</code> or <code>1</code>–<code>4</code> | Nav: <code>←</code>/<code>→</code> or <code>P</code>/<code>N</code> | Submit: <code>S</code> → <code>Enter</code>
          </div>
        </div>
      </div>

      {/* Submit modal */}
      {showModal && (
        <div className="modal-ov" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Submit Test?</h3>
            <p>
              You answered <strong>{answered} of {questions.length}</strong> questions.
              {answered < questions.length && ` ${questions.length - answered} question(s) unattempted.`}
              <br /><br />
              Submit to see your score, grade, and full step-by-step solutions.
            </p>
            <div className="modal-btns">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary"   onClick={handleSubmit}>Submit Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
