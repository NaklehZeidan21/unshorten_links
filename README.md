# unshorten_links

[Visit Site:](https://test-xhs4.onrender.com)
Know Where You're Going. Unmask Shortened URLs for Enhanced Security.

## 📚API Documentation
This page provides documentation for the URL Unshortener API, which allows you to expand short URLs to preview their destination without visiting them.

### 🔗 Endpoint: /api/unshorten (GET)
This endpoint allows you to unshorten a given short URL and retrieve its original URL. The API rate limit is 25 requests per day.

### 🚀 Request:
GET /api/unshorten?url=<short_url_request>

### 📦 Response: (JSON)
` {
  "originalUrl": "original_url_response"
}
 `
If the response is successful, it will contain the original URL corresponding to the provided short URL in JSON format.

### ⏰ Rate Limiting
The API endpoint `/api/unshorten` has a rate limit of 25 requests per day. This means each unique IP address is allowed to make up to 25 requests to the endpoint within a 24-hour period. If the rate limit is exceeded, subsequent requests will receive a status code of 429 (Too Many Requests) along with an error message.
