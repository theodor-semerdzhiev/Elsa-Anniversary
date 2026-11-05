import { useEffect, useState } from "react";
import type { AnniversaryConfig } from "../config/types";
import { calendarDuration, dayDifference, today } from "../utils/dates";
export function Counter({ config: c }: { config: AnniversaryConfig }) {
  const getToday = () => {
    try {
      return today(c.counter.timeZone);
    } catch {
      return today();
    }
  };
  const [date, setDate] = useState(getToday);
  useEffect(() => {
    const id = window.setInterval(() => setDate(getToday()), 1000);
    return () => clearInterval(id);
  }, [c.counter.timeZone]);
  const start = c.counter.startDate || c.general.startDate;
  const days = dayDifference(start, date);
  const duration = calendarDuration(start, date);
  return (
    <div className="counter-paper paper">
      <span className="tape" />
      <span className="eyebrow">{c.counter.heading}</span>
      {days === null ? (
        <p>{c.labels.invalidDate}</p>
      ) : (
        <>
          {c.counter.showTotalDays && c.counter.format !== "calendar" && (
            <div className="day-count">
              <strong>{days.toLocaleString()}</strong>
              <span className="hand">{c.labels.days}</span>
            </div>
          )}
          {c.counter.showCalendar &&
            c.counter.format !== "days" &&
            duration && (
              <div className="calendar-count">
                {duration.years} {c.labels.years} <span>·</span>{" "}
                {duration.months} {c.labels.months} <span>·</span>{" "}
                {duration.days} {c.labels.days}
              </div>
            )}
          <p className="hand">{c.general.durationLabel}</p>
        </>
      )}
      <p>{c.counter.subtitle}</p>
      {c.counter.showAnniversary &&
        date.slice(5) === (c.general.anniversaryDate || start).slice(5) && (
          <p className="anniversary-message">{c.counter.anniversaryMessage}</p>
        )}
      <span className="counter-flower" aria-hidden="true">
        ✿
      </span>
    </div>
  );
}
