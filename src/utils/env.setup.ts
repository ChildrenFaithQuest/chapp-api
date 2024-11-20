import { existsSync } from 'fs';

export const getEnvPath = (): string => {
  const localEnv = `.env.${process.env.NODE_ENV || 'development'}.local`;
  if (existsSync(localEnv)) {
    return localEnv;
  }

  const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
  if (existsSync(envFile)) {
    return envFile;
  }
  // Fallback to .env if none of the above exist
  return '.env';
};
