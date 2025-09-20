import {get, post, postForm} from './http.js';

export function listBooks({c = '', q = '', page = 1, size = 10} = {}) {
    return get('/api/books', {c, q, page, size});
}

export function getBook(id) {
    return get(`/api/books/${id}`);
}

export function borrowBook(bookId) {
    return post('/api/loans/borrow',{bookId});
}

export function returnBook(loanId) {
    return postForm(`/api/loans/${loanId}/return`, {});
}

export function myLoans() {
    return get('/api/loans/me');
}

export function uploadBook({title, author, categories, summary, coverFile}) {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('author', author);
    fd.append('categories', categories);
    fd.append('summary', summary);
    if (coverFile) fd.append('cover', coverFile);
    return postForm('/api/books/upload', fd, true);
}
