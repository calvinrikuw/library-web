import {BACKEND_BASE_URL} from './config.js';
import {getToken, clearAuth} from './storage.js';

/**
 * 请求响应处理
 *
 */
async function handleResponse(res) {
    // 权限/认证相关的错误码
    if (res.status === 401 || res.status === 403) {
        clearAuth();
        throw new Error('会话过期请重新登录');
    }
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.code === "ERROR") {
        throw new Error(data?.message || res.statusText);
    }
    return data?.data ?? data;
}

/**
 * 发送 JSON POST 请求
 *
 */
export async function postJson(path, payload = {}) {
    const res = await fetch(BACKEND_BASE_URL + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': getToken() || ''
        },
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
}

/**
 * 发送 GET 请求
 *
 */
export async function get(path, params) {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(BACKEND_BASE_URL + path + q, {
        headers: {
            'Accept': 'application/json',
            'Authorization': getToken() || ''
        }
    });
    return handleResponse(res);
}

/**
 * 发送 FORM表单 POST 请求
 *
 */
export async function postForm(path, formDataOrParams, isMultipart = false) {
    let options = {method: 'POST', headers: {'Accept': 'application/json', 'Authorization': getToken() || ''}};
    if (isMultipart) {
        options.body = formDataOrParams;
    } else {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        options.body = new URLSearchParams(formDataOrParams);
    }
    const res = await fetch(BACKEND_BASE_URL + path, options);
    return handleResponse(res);
}
