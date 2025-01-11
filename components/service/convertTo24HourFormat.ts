export default function convertTo24HourFormat(time: string): string {
    const [hours, minutesPart] = time.split(":");
    const minutes = minutesPart.slice(0, 2); // Extract the minutes
    const period = minutesPart.slice(2).trim(); // Extract AM/PM
    let hour = parseInt(hours, 10);
  
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
  
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  }
  