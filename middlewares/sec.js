  // middlewares/securityHeaders.js

  function setSecurityHeaders(req, res, next) {
    // Set X-Content-Type-Options Header
    res.setHeader('X-Content-Type-Options', 'nosniff');
  
    // Set X-Frame-Options Header
    res.setHeader('X-Frame-Options', 'DENY');
  
    // Set Content-Security-Policy Header
    res.setHeader('Content-Security-Policy', "default-src 'self'");
  
    // Set Strict-Transport-Security Header
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  
    // Continue processing the request
    next();
  }
  
  module.exports = { setSecurityHeaders };