function checkEmptyRequestBody(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Empty JSON object in request body' });
    }
    next();
  }

  
  module.exports = { checkEmptyRequestBody };
  