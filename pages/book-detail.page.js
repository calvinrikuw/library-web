import {
    getQueryParam, getSubmittingState,
    handleImageUrl,
    qrySelector,
    redirect2Login, setSubmittingState,
    showConfirmation,
    toast
} from '../assets/js/util.js';
import {addFavorite, borrowBook, getBook, listFavorites, removeFavorite} from "../assets/js/books.api.js";
import {renderDropdownList, renderLoginState} from "./common.page.js";
import {isUserAuthed} from "../assets/js/auth.js";

let myFavorites = new Set();

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
 * 获取当前用户的收藏书籍
 *
 */
async function loadFavorites() {
    if (myFavorites.size > 0) return;
    try {
        const res = await listFavorites();
        const arr = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        myFavorites = new Set(arr.map(b => String(b.id)));
    } catch (e) {
        myFavorites = new Set();
    }
}

function syncFavBtn(btn, favored) {
    btn.setAttribute('aria-pressed', favored ? 'true' : 'false');
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');
    if (favored) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        text.textContent = '已收藏';
        btn.title = '取消收藏';
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        text.textContent = '收藏';
        btn.title = '收藏';
    }
}

async function handleFavorite(bookId, favBtn) {
    if (!isUserAuthed()) {
        const redirectUrl = window.location.pathname + window.location.search;
        redirect2Login(redirectUrl);
        return;
    }
    const next = favBtn.getAttribute('aria-pressed') !== 'true';
    syncFavBtn(favBtn, next);
    try {
        if (next) {
            await addFavorite(bookId);
            myFavorites.add(String(bookId));
            toast("收藏成功", "success");
        } else {
            await removeFavorite(bookId);
            myFavorites.delete(String(bookId));
            toast("已取消收藏", "success");
        }
    } catch (e) {
        syncFavBtn(favBtn, !next);
        toast(e?.message || "操作失败", "error");
    }
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
            handleBorrow(book, () => {
                setTimeout(() => {
                    window.location.href = "my-borrow.html"
                }, 2000);
            })
        );

        // 处理书籍收藏
        const favBtn = qrySelector("#fav-button", node);
        const favored = myFavorites.has(String(book.id));
        syncFavBtn(favBtn, favored);
        favBtn.addEventListener('click', () => handleFavorite(book.id, favBtn));

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

    const button = qrySelector("#borrow-button");

    // 避免重复提交
    if (getSubmittingState()) return;

    showConfirmation(
        `确定要借阅《${book.title}》吗？`,
        async () => {
            try {
                setSubmittingState(button, true);

                const res = await borrowBook(book.id);
                if (res?.code === "OK") {
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
    loadFavorites();
    renderBook();
});