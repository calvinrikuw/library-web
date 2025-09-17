const TOKEN_KEY = 'access_token';
const USERNAME_KEY = 'user_name';
const EXPIRES_KEY = 'token_exp';

/**
 * 保存认证信息到 localStorage
 *
 */
export function saveAuth({ accessToken, tokenType, expiresInSeconds, userName }) {
  //令牌类型+访问令牌
  localStorage.setItem(TOKEN_KEY, `${tokenType} ${accessToken}`);
  localStorage.setItem(USERNAME_KEY, userName || '');
  const expAt = Date.now() + (Number(expiresInSeconds)|| 3600);
  localStorage.setItem(EXPIRES_KEY, String(expAt));
}

/**
 * 获取存储的 Token
 *
 */
export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }
  return token;
}

/**
 * 获取当前登录用户名
 *
 */
export function getUserName() {
  return localStorage.getItem(USERNAME_KEY) || '';
}

/**
 * 判断用户是否已认证
 *
 */
export function isAuthed() {
  return !!getToken();
}

/**
 * 清除本地认证信息
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}
