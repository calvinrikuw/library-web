import {getQueryParam, handleImageUrl, qrySelector} from '../assets/js/util.js';
import {listBooks} from "../assets/js/books.api.js";
import {renderDropdownList, renderLoginState} from "./common.page.js";

// 定义全局分页查询的状态
const state = {category: undefined, keywords: undefined, page: 1, size: 12};

/**
 * 增加搜索框事件监听
 *
 */
function addSearchListener() {
    const keywords = getQueryParam('q');
    const searchText = qrySelector('#searchText');
    const searchButton = qrySelector('#searchButton');

    if (keywords) {
        state.keywords = keywords;
        searchText.value = keywords;
    }

    // 搜索输入框回车事件
    searchText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            state.keywords = searchText.value.trim();
            handleRenderBooks();
        }
    });
    // 搜索按钮点击事件
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        state.keywords = searchText.value.trim();
        handleRenderBooks();
    });
}

/**
 * 渲染书籍分类区域
 *
 */
function renderCategories() {
    const categoriesDiv = qrySelector('#categories');
    const categoryText = qrySelector('#all-books');
    const data = [{name: '全部', value: 'all'}, {name: '技术类', value: 'tech'}, {name: '管理类', value: 'mgt'}];

    // 默认分类
    let current = 'all';
    categoriesDiv.innerHTML = '';

    for (const clazz of data) {
        const item = document.createElement('div');
        //item active
        item.className = 'item' + (clazz.value === current ? ' active' : '');
        item.textContent = clazz.name;

        item.addEventListener('click', (e) => {
            e.preventDefault();
            // 切换选中样式
            categoriesDiv.querySelectorAll('.item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            // 更新文本与当前值
            categoryText.textContent = clazz.name;
            current = clazz.value;
            state.category = current;
            state.page = 1;
            handleRenderBooks();
        });
        categoriesDiv.appendChild(item);
    }
}

/**
 * 渲染书籍
 *
 */
function renderBooks(booksGrid, books) {
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
        <a href="book-detail.html?id=${encodeURIComponent(book.id)}"><img src="${handleImageUrl(book.coverUrl)}" alt="${book.title}"></a>
        <a href="book-detail.html?id=${encodeURIComponent(book.id)}"><h3>${book.title}</h3></a>
        <div class="author">${book.author}</div>
        <p>${book.summary}</p>`;
        booksGrid.appendChild(bookCard);
    });
}

/**
 * 渲染书籍页面
 *
 */
async function renderBooksPage() {
    const params = {c: state.category, q: state.keywords, page: state.page, size: state.size};
    const booksGrid = qrySelector('#booksGridDiv');

    try {
        const data = await listBooks(params);
        //(data == null) ? undefined : data.items
        const books = data?.items || [];

        booksGrid.innerHTML = '';
        if (!Array.isArray(books) || books.length === 0) {
            booksGrid.innerHTML = '<p class="no-results">没有找到相关图书</p>';
            return;
        }
        renderBooks(booksGrid, books);

        renderPagination(data.total, params.page, params.size, (page) => {
            state.page = page;
            handleRenderBooks();
        });
    } catch (err) {
        booksGrid.innerHTML = `<p class="no-results">${err?.message || '加载失败'}</p>`;
    }
}

/**
 * 渲染分页区域
 *
 */
function renderPagination(total, page, size, onChange) {
    // 计算总页数
    const totalPages = Math.max(1, Math.ceil(total / size));
    const pagination = qrySelector('#paginationDiv');

    pagination.innerHTML = '';

    // 生成上一页按钮
    const prevLi = document.createElement('li');
    if (page === 1) {
        prevLi.classList.add('disabled');
    }
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.textContent = '上一页';
    prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (page > 1) {
            // 渲染上一页
            renderPagination(total, page - 1, size, onChange);
            // 调用回调函数
            if (onChange) onChange(page - 1);
        }
    });
    prevLi.appendChild(prevLink);
    pagination.appendChild(prevLi);

    // 生成数字分页
    const pageNumbers = getPageNumbers(page, totalPages);
    pageNumbers.forEach(num => {
        const li = document.createElement('li');
        if (num === page) {
            li.classList.add('active');
        }
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = num;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            renderPagination(total, num, size, onChange);
            if (onChange) onChange(num);
        });
        li.appendChild(link);
        pagination.appendChild(li);
    });

    // 生成下一页按钮
    const nextLi = document.createElement('li');
    if (page === totalPages) {
        nextLi.classList.add('disabled');
    }
    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.textContent = '下一页';
    nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (page < totalPages) {
            renderPagination(total, page + 1, size, onChange);
            if (onChange) onChange(page + 1);
        }
    });
    nextLi.appendChild(nextLink);
    pagination.appendChild(nextLi);
}

function getPageNumbers(currentPage, totalPages) {
    const pageNumbers = [];
    // 每边显示的页码数，比如在第一页显示 "1 2 3" ，在最后一页显示 "8 9 10"
    const range = 2;

    // 计算显示的页码范围
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
    }

    return pageNumbers;
}

/**
 * 渲染书籍页面总入口
 *
 */
function handleRenderBooks() {
    renderBooksPage();
}

document.addEventListener('DOMContentLoaded', () => {
    renderLoginState();
    addSearchListener();
    renderDropdownList();
    renderCategories();
    handleRenderBooks();
});

