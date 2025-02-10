import { eachDayOfInterval, format } from "date-fns";

export const updateTodosWithRange = (
  todos: Record<string, any[]>,
  selectedStartDate: string | null,
  selectedEndDate: string | null
): Record<string, any[]> => {
  if (!selectedStartDate || !selectedEndDate) return todos; // Jika rentang tanggal tidak valid, kembalikan todos asli

  // 1. Dapatkan semua tanggal dalam rentang
  const dateRange = eachDayOfInterval({
    start: new Date(selectedStartDate),
    end: new Date(selectedEndDate),
  }).map((date) => format(date, "yyyy-MM-dd"));

  // 2. Update todos: Ganti key lama dengan tanggal dalam rentang
  const updatedTodos = dateRange.reduce<Record<string, any[]>>(
    (acc, date, index) => {
      const oldKey = Object.keys(todos)[index];
      if (oldKey) {
        acc[date] = todos[oldKey];
      } else {
        acc[date] = [];
      }
      return acc;
    },
    {}
  );

  return updatedTodos;
};