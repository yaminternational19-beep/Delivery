/**
 * Middleware to parse JSON strings from request body
 * Use before validate() middleware for multipart/form-data requests
 */
const jsonParser = (fields = []) => (req, res, next) => {
  if (req.body) {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (error) {
          // If parsing fails, we keep the original string and let the validator catch it
          console.warn(`JSON parsing failed for field: ${field}`, req.body[field]);
        }
      }
    });
  }
  next();
};

export default jsonParser;
