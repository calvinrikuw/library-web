import {qrySelector, toast} from '../assets/js/util.js';
import {clearAuth, getToken, getUserName} from "../assets/js/storage.js";

/**
 * 渲染导航栏右侧用户栏
 *
 */
function renderLoginState() {
    const loginButton = qrySelector('#login-button');
    const personalDiv = qrySelector('#personalDiv');
    const account = qrySelector('#account');

    if (getToken()) {
        loginButton.style.display = 'none';
        personalDiv.style.display = 'block';
        account.innerText = getUserName();
    } else {
        loginButton.style.display = 'block';
        personalDiv.style.display = 'none';
    }
}

function renderDropdownList() {
    const dropdownButton = qrySelector('#dropdownDiv');
    dropdownButton.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownButton.classList.toggle('active');
    });
    const menu = qrySelector('#menuDiv');
    // 点击页面其他地方时隐藏菜单
    document.addEventListener('click', (e) => {
        e.preventDefault();
        if (!dropdownButton.contains(e.target) && !menu.contains(e.target)) {
            dropdownButton.classList.remove('active');
        }
    });
    const layoutButton = qrySelector('#layout-button')
    layoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        clearAuth();
        //刷新页面
        location.reload();
    });
}

/**
 * 渲染导航栏右侧用户栏
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
            renderBooks();
        });
        categoriesDiv.appendChild(item);
    }
}

async function renderBooks() {

}

async function render(page = 1) {
    // const q = qs('#q').value.trim();
    // try{
    //     const data = await listBooks({q, page, size:12});
    //     const list = data?.items || data?.records || data?.list || data; // tolerate DTO naming
    //     const total = data?.total || list?.length || 0;
    //     const box = qs('#book-list');
    //     box.innerHTML = (list||[]).map(b=>`
    //   <a class="card card-book" href="book-detail.html?id=${b.id}">
    //     <img class="cover" src="${b.coverUrl||'assets/img/placeholder.png'}" alt="">
    //     <div class="meta">
    //       <div class="title">${b.title||''}</div>
    //       <div class="author">${b.author||''}</div>
    //       <div class="badge">${b.categories||''}</div>
    //     </div>
    //   </a>`).join('');
    //     qs('#total').textContent = total;
    // }catch(e){
    //     toast(e.message||'Load failed');
    // }
}

document.addEventListener('DOMContentLoaded', () => {
    renderLoginState();
    renderDropdownList();
    renderCategories();

});

