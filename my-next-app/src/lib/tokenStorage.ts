const TOKEN_KEY = 'cf_api_token';

export function storeToken(token: string): void {
  // Use sessionStorage instead of localStorage if you want the token to be cleared when the tab is closed
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return !!getToken();
} 