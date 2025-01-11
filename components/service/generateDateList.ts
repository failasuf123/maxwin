export const generateDateList = (start: string, end: string): Date[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates: Date[] = [];
    while (startDate <= endDate) {
      dates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
  };