import { useEffect, useState } from 'react';
import { timer, interval } from 'rxjs';
import { first, startWith, scan, share } from 'rxjs/operators';
import s from './Stopwatch.module.css';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const stopwatch$ = interval(1000);

  useEffect(() => {
    const start = stopwatch$
      .pipe(
        startWith(time),
        scan(time => time + 1),
        share(),
      )
      .subscribe(value => {
        if (isActive) {
          setTime(value);
        }
      });

    return () => start.unsubscribe();
  }, [isActive, time, stopwatch$]);

  const handleClick = e => {
    if (e.target.textContent === 'Start') return toggleActive();
    handleReset();
    toggleActive();
  };

  const handleReset = () => {
    setTime(0);
  };

  const handleWait = () => {
    timer(300).pipe(first()).subscribe(setIsActive(false));
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const displayStopwatch = time => {
    return new Date(time * 1000).toISOString().substr(11, 8);
  };

  return (
    <>
      <div className={s.time}>{displayStopwatch(time)}</div>
      <div className={s.wrapperBtn}>
        <button onClick={handleClick} className={s.btn}>
          {!isActive ? 'Start' : 'Stop'}
        </button>
        <button
          onDoubleClick={handleWait}
          disabled={!isActive}
          className={s.btn}
        >
          Wait
        </button>
        <button onClick={handleReset} disabled={!isActive} className={s.btn}>
          Reset
        </button>
      </div>
    </>
  );
}
