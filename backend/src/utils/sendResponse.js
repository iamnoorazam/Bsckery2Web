const sendResponse = (res, statusCode, message, data = null) => {
  const payload = {
    success: statusCode < 400,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) payload.data = data;

  // Disable API response caching to avoid stale UI data after create/update/delete.
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");

  return res.status(statusCode).json(payload);
};

export default sendResponse;
