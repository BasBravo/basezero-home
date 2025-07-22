let interval;

export const createInterval = (callback, delay) => {
    interval = setInterval(callback, delay);
    return interval;
};

export const clearInterval = () => {
    clearInterval(interval);
};
