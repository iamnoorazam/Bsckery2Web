const sendResponse = (res, statusCode, message, data = null) => {
  const payload = {
    success: statusCode < 400,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) payload.data = data;

  // Set cache headers for GET requests with 200 status
  if (res.req.method === "GET" && statusCode === 200) {
    res.set("Cache-Control", "private, max-age=300"); // 5 minutes
  } else {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  }

  return res.status(statusCode).json(payload);
};

export default sendResponse;
