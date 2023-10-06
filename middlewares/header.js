// headers.js
function onlyJson(req, res, next) {
    // Check if the request's 'Content-Type' header is set to JSON
    const contentType = req.headers['content-type'];
    if (!contentType || contentType.indexOf('application/json') === -1) {
      return res.status(415).json({ error: 'Unsupported Media Type: Only JSON is allowed' });
    }
  
    next();
  }



  module.exports = { onlyJson };
  