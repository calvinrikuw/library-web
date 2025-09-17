/**
 * 查询返回指定的页面元素
 *
 */
export function qrySelector(sel, root = document) {
    return root.querySelector(sel);
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