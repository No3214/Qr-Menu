/**
 * Rate Limiting Utility
 * Prevents API abuse and excessive requests
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface RequestRecord {
    count: number;
    resetTime: number;
}

const requestRecords = new Map<string, RequestRecord>();

/**
 * Check if request should be rate limited
 */
export function isRateLimited(key: string, config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }): boolean {
    const now = Date.now();
    const record = requestRecords.get(key);

    if (!record || now > record.resetTime) {
        // Start new window
        requestRecords.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return false;
    }

    if (record.count >= config.maxRequests) {
        return true; // Rate limited
    }

    record.count++;
    return false;
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
    let lastCall = 0;

    return function (this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            return func.apply(this, args) as ReturnType<T>;
        }
        return undefined;
    };
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<T>): void {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, wait);
    };
}

/**
 * Create a rate-limited async function
 */
export function rateLimitedAsync<T extends (...args: unknown[]) => Promise<unknown>>(
    func: T,
    key: string,
    config?: RateLimitConfig
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    return async function (this: unknown, ...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
        if (isRateLimited(key, config)) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        return func.apply(this, args) as Awaited<ReturnType<T>>;
    };
}
