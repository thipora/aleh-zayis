import dayjs from 'dayjs';

export function calculateWorkQuantityFromTimes(start_time, end_time) {
  if (!start_time || !end_time) return null;

  const start = dayjs(`2000-01-01T${start_time}`);
  const end = dayjs(`2000-01-01T${end_time}`);
  const diffInMinutes = end.diff(start, 'minute');

  if (diffInMinutes <= 0) return null;

  return (diffInMinutes / 60).toFixed(3);
};
