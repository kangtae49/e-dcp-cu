export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, timeout = 5000 } = options;

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    );

    return await Promise.race([fn(), timeoutPromise]);
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`Retrying in ${delay}ms... (${retries} attempts left)`);

    await new Promise((resolve) => setTimeout(resolve, delay));

    return retryWithBackoff(fn, {
      retries: retries - 1,
      delay: delay * 2,
      timeout
    });
  }
}