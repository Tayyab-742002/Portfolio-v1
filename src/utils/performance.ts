export const measurePerformance = (component: string) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      if (duration > 16.67) { // 60fps threshold
        console.warn(`[Performance] ${component} took ${duration.toFixed(2)}ms to render`);
      }
    };
  }
  return () => {};
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const measureMemory = async (component: string) => {
  if (process.env.NODE_ENV === 'development' && 'performance' in window) {
    try {
      const memory = (performance as any).memory;
      if (memory) {
        console.log(`[Memory] ${component}:`, {
          usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
          totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
        });
      }
    } catch (e) {
      console.warn('Memory measurement not supported');
    }
  }
};
