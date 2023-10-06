const { RateLimiterMemory } = require('rate-limiter-flexible');

// Calculate the number of seconds in a day
const secondsInDay = 24 * 60 * 60;

// Calculate the number of points for 100 requests per day
const pointsPerDay = 25;

// Create a rate limiter instance
const rateLimiter = new RateLimiterMemory({
  points: pointsPerDay,
  duration: secondsInDay,
});

// Custom rate limit exceeded response
const rateLimitExceeded = (req, res) => {
  res.status(429).json({
    message: 'Hey! relax. Too many requests, please try again later.',
  });
};

// Rate limit by IP middleware 
const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip); // Consume a request point for the IP
    next();
  } catch (error) {
    rateLimitExceeded(req, res);
  }
};

module.exports = rateLimiterMiddleware;
