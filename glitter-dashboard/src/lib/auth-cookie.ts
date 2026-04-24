const AUTH_COOKIE_NAME = 'glitter_auth_flag';
// 7 days — matches the refresh token expiry
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const authCookie = {
  set(): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${AUTH_COOKIE_NAME}=true; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  },

  clear(): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
  },

  isSet(): boolean {
    if (typeof document === 'undefined') return false;
    return document.cookie
      .split(';')
      .some((c) => c.trim().startsWith(`${AUTH_COOKIE_NAME}=true`));
  },
};