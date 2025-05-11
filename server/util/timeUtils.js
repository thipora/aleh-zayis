import dayjs from 'dayjs';

/**
 * מקבלת start_time ו-end_time בפורמט HH:mm
 * מחזירה כמות שעות מדויקת (כמספר עשרוני) או null אם הנתונים לא תקינים
 */
export function calculateWorkQuantityFromTimes(start_time, end_time) {
  if (!start_time || !end_time) return null;

  const start = dayjs(`2000-01-01T${start_time}`);
  const end = dayjs(`2000-01-01T${end_time}`);
  const diffInMinutes = end.diff(start, 'minute');

  if (diffInMinutes <= 0) return null;

  return (diffInMinutes / 60).toFixed(3);
};
