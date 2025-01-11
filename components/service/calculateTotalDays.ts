export const calculateTotalDays = (start: string, end: string): number => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const timeDifference = endDate - startDate;
    return timeDifference >= 0
      ? Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1
      : 0;
  };