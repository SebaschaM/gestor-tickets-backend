export const convertToLocalTime = (date: Date): Date => {
    const localTimeOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    return new Date(date.getTime() - localTimeOffset);
  };
  