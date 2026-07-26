export function retryWindowSummary(attempts) {
  const list = Array.isArray(attempts) ? attempts : [];
  const successful_attempts = list.filter((attempt) => attempt.ok === true).length;
  const failed_attempts = list.length - successful_attempts;

  return {
    total_attempts: list.length,
    successful_attempts,
    failed_attempts,
    needs_retry: failed_attempts > 0,
  };
}
