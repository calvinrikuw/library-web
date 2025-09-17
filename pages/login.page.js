import {login} from '../assets/js/auth.js';
import {qrySelector, toast} from '../assets/js/util.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = qrySelector('#login-form');

    form.addEventListener('submit', async (e) => {
        // 阻止表单默认提交
        e.preventDefault();

        const accountOrEmail = qrySelector('#accountOrEmail').value.trim();
        const password = qrySelector('#password').value;

        try {
            await login(accountOrEmail, password);
            toast('登录成功', 'success');
            // 登录成功后延迟跳转到首页
            setTimeout(() => {
                location.href = 'index.html';
            }, 500);
        } catch (err) {
            toast(err.message || '登录失败', 'error');
        }
    });
});

