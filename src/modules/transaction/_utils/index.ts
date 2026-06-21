const filterArr = ['-1', '-2', '-3', '-7', '-15', '-30'];

// Generic type constraint for params with time fields
type TimeFilterParams = {
    start_time?: string;
    end_time?: string;
};

export function handleFilterTime<T extends TimeFilterParams>(param: T, filter: string): T {
    // Only process if filter is in filterArr
    if (!filterArr.includes(filter)) {
        return param;
    }

    // Get today's start timestamp (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStartTimestamp = Math.floor(today.getTime());

    const daysAgo = Math.abs(parseInt(filter, 10)) - 1;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - daysAgo);
    const startTimestamp = Math.floor(startDate.getTime());
    return {
        ...param,
        start_time: startTimestamp.toString(),
        ...(filter === '-2' && { end_time: todayStartTimestamp.toString() }),
    };
}
