// Format a date to a readable string
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Format time only (HH:MM)
  export const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Get the start of the day
  export const getStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  
  // Get the end of the day
  export const getEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };
  
  // Get date range for various time periods
  export const getDateRange = (period) => {
    const now = new Date();
    const ranges = {
      today: {
        start: getStartOfDay(now),
        end: getEndOfDay(now)
      },
      yesterday: {
        start: getStartOfDay(new Date(now.setDate(now.getDate() - 1))),
        end: getEndOfDay(new Date(now))
      },
      lastWeek: {
        start: getStartOfDay(new Date(now.setDate(now.getDate() - 7))),
        end: getEndOfDay(new Date())
      },
      lastMonth: {
        start: getStartOfDay(new Date(now.setMonth(now.getMonth() - 1))),
        end: getEndOfDay(new Date())
      }
    };
  
    return ranges[period] || null;
  };
  
  // Check if a date is within a range
  export const isDateInRange = (date, startDate, endDate) => {
    const checkDate = new Date(date);
    return checkDate >= startDate && checkDate <= endDate;
  };
  
  // Group dates by a specific interval (hour, day, week, month)
  export const groupDatesByInterval = (dates, interval) => {
    return dates.reduce((groups, date) => {
      let key;
      const dateObj = new Date(date);
  
      switch (interval) {
        case 'hour':
          key = dateObj.setMinutes(0, 0, 0);
          break;
        case 'day':
          key = getStartOfDay(dateObj).getTime();
          break;
        case 'week':
          const startOfWeek = new Date(dateObj);
          startOfWeek.setDate(dateObj.getDate() - dateObj.getDay());
          key = getStartOfDay(startOfWeek).getTime();
          break;
        case 'month':
          key = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime();
          break;
        default:
          key = dateObj.getTime();
      }
  
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(date);
      return groups;
    }, {});
  };
  
  // Parse flexible date strings
  export const parseFlexibleDate = (dateString) => {
    // Handle relative date strings
    const relativeDates = {
      'yesterday': () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
      },
      'last night': () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(20, 0, 0, 0); // Assuming night starts at 8 PM
        return date;
      },
      'this morning': () => {
        const date = new Date();
        date.setHours(6, 0, 0, 0); // Assuming morning starts at 6 AM
        return date;
      }
    };
  
    const lowercaseInput = dateString.toLowerCase();
    
    // Check for relative dates
    for (const [key, handler] of Object.entries(relativeDates)) {
      if (lowercaseInput.includes(key)) {
        return handler();
      }
    }
  
    // If not a relative date, try parsing as regular date
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };