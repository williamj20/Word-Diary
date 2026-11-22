export const logRecoveryError = (
  operation: 'request' | 'verify' | 'session' | 'update',
  error: unknown
) => {
  console.error(`Password recovery (${operation})`, error);
};
