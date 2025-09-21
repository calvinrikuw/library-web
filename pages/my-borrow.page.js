import {renderDropdownList, renderLoginState} from "./common.page.js";
import {handleImageUrl, qrySelector, redirect2Login, showConfirmation, toast} from "../assets/js/util.js";
import {isUserAuthed} from "../assets/js/auth.js";
import {myLoans, returnBook} from "../assets/js/books.api.js";


async function renderTable() {
    const table = qrySelector('#borrow-table');
    const tableBody = qrySelector('tbody', table);

    const books = await myLoans();

    tableBody.innerHTML = '';
    if (!Array.isArray(books) || books.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">无信息</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    books.forEach(book => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td><img src="${handleImageUrl(book.coverUrl)}" alt="${book.title}"></td>
                <td>${book.title}</td>
                <td>${book.loanDate}</td>
                <td class="${!book.returnDate ? 'borrowing' : 'returned'}">
                <span class="status-chip">${!book.returnDate ? '借阅中' : '已归还'}</span>
                </td>
                <td><button ${!book.returnDate ? '' : 'disabled'}>归还</button></td>
            `;
        tableBody.appendChild(tr);

        const returnBtn = tr.querySelector('button');
        returnBtn.addEventListener('click', () => {
            handleReturn(book, () => {
                setTimeout(() => {
                    renderTable();
                }, 1000);

            })
        });
    })
}

function handleReturn(book, onSuccess) {
    if (!isUserAuthed()) {
        const redirectUrl = window.location.pathname;
        redirect2Login(redirectUrl);
        return;
    }

    showConfirmation(
        '确定要归还这本书吗？',
        async () => {
            try {
                const res = await returnBook(book.loanId);
                if (res?.code === "OK") {
                    toast("归还成功", "success");
                    if (onSuccess) onSuccess();
                } else {
                    toast(res.message || "归还失败", "error");
                }
            } catch (err) {
                toast(err?.message || "归还失败", "error");
            }
        },
        () => {
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    renderLoginState();
    renderDropdownList();
    renderTable();
});