export function getApiUrl(): string {
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3730/api';
}
