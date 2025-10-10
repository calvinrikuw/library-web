import {BACKEND_BASE_URL} from "./config.js";

// 提交中的标志位
let isSubmitting = false;

/**
 * 查询返回指定的页面元素
 *
 */
export function qrySelector(sel, root = document) {
    return root.querySelector(sel);
}

/**
 * 返回 URL 参数
 *
 */
export function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

/**
 * 返回静态资源地址
 *
 */
export function handleImageUrl(url) {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/static')) return BACKEND_BASE_URL + url;
    return BACKEND_BASE_URL + '/static' + url;
}

/**
 * 重定向至登录页
 *
 */
export function redirect2Login(redirectUrl) {
    let url = 'login.html';
    if (redirectUrl) url += '?redirect=' + redirectUrl;
    window.location.href = url;
}

/**
 * 模态确认对话框
 *
 */
export function showConfirmation(message, onConfirm, onCancel) {
    const modal = qrySelector("#confirmationModal");
    const messageBox = modal.querySelector(".modal-message");
    const confirmBtn = qrySelector("#confirmBtn");
    const cancelBtn = qrySelector("#cancelBtn");

    messageBox.textContent = message || "你确定要执行该操作吗？";
    modal.style.display = "flex";

    confirmBtn.onclick = null;
    cancelBtn.onclick = null;

    confirmBtn.onclick = () => {
        modal.style.display = "none";
        if (onConfirm) onConfirm();
    };
    // 点击遮罩层关闭
    cancelBtn.onclick = () => {
        modal.style.display = "none";
        if (onCancel) onCancel();
    };
}

/**
 * 全局 toast 提示
 *
 */
export function toast(message, type = 'success') {
    // 创建提示框容器
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // 创建图标
    const icon = document.createElement('i');
    if (type === 'error') {
        icon.classList.add('toast-icon', 'fa-solid', 'fa-circle-xmark');
    } else if (type === 'success') {
        icon.classList.add('toast-icon', 'fa-solid', 'fa-circle-check');
    }

    // 创建文本内容
    const text = document.createElement('span');
    text.textContent = message;

    // 把图标和文本加到提示框中
    toast.appendChild(icon);
    toast.appendChild(text);

    // 将提示框添加到页面
    document.body.appendChild(toast);

    // 设置动画：显示后3秒后消失
    setTimeout(() => toast.classList.add('toast-hide'), 3000);
    // 移除提示框
    setTimeout(() => document.body.removeChild(toast), 3000);
}

/**
 * 用于禁用表单的元素，防止重复提交
 *
 */
export function setSubmittingState(target, submitting) {
    isSubmitting = submitting;

    if (!target) return;
    if (target.tagName === "FORM") {
        // 禁用表单下的所有元素
        target.querySelectorAll("input, textarea, button").forEach(el => {
            el.disabled = submitting;
        });
    } else {
        target.disabled = submitting;
    }
}

/**
 * 返回是否提交中的状态
 *
 */
export function getSubmittingState() {
    return isSubmitting;
}

/**
 * 支持排序表格初始化
 *
 */
export function initTableSort(tableId) {
    const table = document.getElementById(tableId);
    const ths = table.tHead.querySelectorAll('th.sortable');
    const tbody = table.tBodies[0];
    ths.forEach(th => {
        th.onclick = () => {
            const col = +th.dataset.col || 0;
            const type = (th.dataset.type || 'text').toLowerCase();
            const cur = th.dataset.order;
            const next = cur === 'asc' ? 'desc' : 'asc';
            ths.forEach(x => x.removeAttribute('data-order'));
            th.dataset.order = next;
            const rows = Array.from(tbody.rows);
            rows.sort((a, b) => {
                const va = (a.cells[col]?.textContent || '').trim();
                const vb = (b.cells[col]?.textContent || '').trim();
                if (type === 'date') {
                    const da = new Date(va).getTime() || 0;
                    const db = new Date(vb).getTime() || 0;
                    return next === 'asc' ? da - db : db - da;
                }
                const r = va.localeCompare(vb, 'zh-Hans-CN', {sensitivity: 'base', numeric: true});
                return next === 'asc' ? r : -r;
            });
            tbody.append(...rows);
        };
    });
}
