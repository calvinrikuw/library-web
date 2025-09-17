import {postJson} from './http.js';
import {saveAuth, clearAuth, getUserName, isAuthed} from './storage.js';

export async function login(accountOrEmail, password) {
    const data = await postJson('/api/auth/login', {accountOrEmail, password});
    saveAuth(data);
    return data;
}

export function logout() {
    clearAuth();
}

export function currentUserName() {
    return getUserName();
}

export function isUserAuthed() {
    return isAuthed();
}
