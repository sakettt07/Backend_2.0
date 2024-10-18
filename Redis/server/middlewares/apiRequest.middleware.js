import { redis } from "../app.js";
export const apiRequest = (limit = 10, expireTime = 60) => async (req, res, next) => {
    try {
        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const key = `${clientIp}:request_count`;

        // Increment request count for the client
        const request_count = await redis.incr(key);

        if (request_count === 1) {
            // Set expiration time (in seconds) for the key if it's the first request
            await redis.expire(key, expireTime);
        }
        const timeRemaining=await redis.ttl(key);
        if (request_count > limit) {
            return res.status(429).json({
                message: `Too many requests ||  please try again after ${timeRemaining}seconds`,
            });
        }

        // If under the limit, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in rate limiting middleware", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
