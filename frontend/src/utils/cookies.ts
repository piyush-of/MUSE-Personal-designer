export function getCookie(name: string): string {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=') || '';
}

export function getCsrfToken(): string {
  const token = getCookie('muse_csrf');
  return token ? decodeURIComponent(token) : '';
}
