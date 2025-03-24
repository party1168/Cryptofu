const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetry: number = 3,
  delay: number = 1000
) => {
  let lastError;
  for (let i = 0; i < maxRetry; i++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
  throw lastError;
};

export default withRetry;
