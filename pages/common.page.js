import {qrySelector} from '../assets/js/util.js';
import {currentUserName, isUserAuthed, logout} from "../assets/js/auth.js";

/**
 * 渲染用户登录区域下拉菜单
 *
 */
export function renderDropdownList() {
    const dropdownButton = qrySelector('#dropdownDiv');
    dropdownButton.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownButton.classList.toggle('active');
    });
    const menu = qrySelector('#menuDiv');
    // 点击页面其他地方时隐藏菜单
    document.addEventListener('click', (e) => {
        if (!dropdownButton.contains(e.target) && !menu.contains(e.target)) {
            dropdownButton.classList.remove('active');
        }
    });
    const logoutButton = qrySelector('#logout-button')
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        //刷新页面
        location.reload();
    });
}

/**
 * 渲染导用户登录区域
 *
 */
export function renderLoginState() {
    const loginButton = qrySelector('#login-button');
    const personalDiv = qrySelector('#personalDiv');
    const account = qrySelector('#account');

    if (isUserAuthed()) {
        loginButton.style.display = 'none';
        personalDiv.style.display = 'block';
        account.innerText = currentUserName();
    } else {
        loginButton.style.display = 'block';
        personalDiv.style.display = 'none';
    }
}