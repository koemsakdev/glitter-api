/**
 * Token storage — reads/writes JWTs to localStorage.
 *
 * We use localStorage (not httpOnly cookies) for thesis simplicity. This is
 * vulnerable to XSS but fine for internal dashboards. If you deploy publicly,
 * switch to httpOnly cookies (requires backend changes to set cookies).
 */

const ACCESS_TOKEN_KEY = 'glitter_access_token';
const REFRESH_TOKEN_KEY = 'glitter_refresh_token';

export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens(): boolean {
    return Boolean(this.getAccessToken() && this.getRefreshToken());
  },
};