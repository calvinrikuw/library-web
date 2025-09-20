import {
    getQueryParam,
    handleImageUrl,
    qrySelector,
    redirect2Login,
    showConfirmation,
    toast
} from '../assets/js/util.js';
import {getBook} from "../assets/js/books.api.js";
import {renderDropdownList, renderLoginState} from "./common.page.js";
import {isUserAuthed} from "../assets/js/auth.js";

/**
 * 增加搜索框事件监听
 *
 */
function addSearchListener() {
    const searchText = qrySelector('#searchText');
    const searchButton = qrySelector('#searchButton');

    // 搜索输入框回车事件
    searchText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.location.href = `index.html?q=${encodeURIComponent(searchText.value.trim())}`;
        }
    });
    // 搜索按钮点击事件
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `index.html?q=${encodeURIComponent(searchText.value.trim())}`;
    });
}

/**
 * 渲染书籍
 *
 */
async function renderBook() {
    const id = getQueryParam('id');
    const bookDetail = qrySelector('#bookDetailDiv');

    try {
        if (!id) {
            bookDetail.innerHTML = '';
            bookDetail.innerHTML = '<p class="no-results">没有找到相关图书</p>';
            return;
        }
        const book = await getBook(id);

        if (!book) {
            bookDetail.innerHTML = '<p class="no-results">没有找到相关图书</p>';
            return;
        }

        const template = qrySelector("#book-template");
        const node = template.content.cloneNode(true);

        qrySelector("#book-image", node).src = handleImageUrl(book.coverUrl);
        qrySelector("#book-image", node).alt = book.title;
        qrySelector("#book-title", node).textContent = book.title || "-";
        qrySelector("#book-author", node).textContent = book.author || "-";
        qrySelector("#book-publisher", node).textContent = book.publisher || "-";
        qrySelector("#book-isbn", node).textContent = book.isbn || "-";
        qrySelector("#book-summary", node).textContent = book.summary || "暂无简介";

        const stock = qrySelector("#book-stock", node);
        stock.textContent = `${book.availableCopies}` + ' 本';
        stock.classList.add(book.availableCopies > 0 ? "ok" : "bad");

        const button = qrySelector("#borrow-button", node);
        button.disabled = !(book.availableCopies > 0);
        button.addEventListener('click', () =>
            handleBorrow(book, () => renderBook(getQueryParam('id')))
        );

        bookDetail.innerHTML = '';
        bookDetail.appendChild(node);

    } catch (err) {
        bookDetail.innerHTML = `<p class="no-results">${err?.message || '加载失败'}</p>`;
    }
}

function handleBorrow(book, onSuccess) {
    if (!isUserAuthed()) {
        const redirectUrl = window.location.pathname + window.location.search;
        redirect2Login(redirectUrl);
        return;
    }
    showConfirmation(
        `确定要借阅《${book.title}》吗？`,
        async () => {
            try {
                //const res = await subscribeBook(book.id);
                const res = 1;
                if (res.success) {
                    toast("借阅成功", "success");
                    if (onSuccess) onSuccess();
                } else {
                    toast(res.message || "借阅失败", "error");
                }
            } catch (err) {
                toast(err?.message || "借阅失败", "error");
            }
        },
        () => {
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    renderLoginState();
    addSearchListener();
    renderDropdownList();
    renderBook();
});