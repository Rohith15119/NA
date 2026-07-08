import { useState, useEffect, useRef } from 'react';

export default function Timer({ durationMinutes, onExpire, paused }) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paused]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isWarn = timeLeft < 300 && timeLeft >= 60; // < 5 mins
  const isDanger = timeLeft < 60; // < 1 min

  let className = "timer";
  if (isDanger) className += " danger";
  else if (isWarn) className += " warn";

  return (
    <div className={className}>
      <span className="timer-icon">⏱️</span>
      <span>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}
