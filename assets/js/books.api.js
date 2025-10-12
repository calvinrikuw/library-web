import {get, getBlob, post, postForm} from './http.js';

export function listBooks({c = '', q = '', page = 1, size = 10} = {}) {
    return get('/api/books', {c, q, page, size});
}

export function getBook(id) {
    return get(`/api/books/${id}`);
}

export function borrowBook(bookId) {
    return post('/api/loans/borrow', {bookId});
}

export function returnBook(loanId) {
    return postForm(`/api/loans/${loanId}/return`, {});
}

export function myLoans() {
    return get('/api/loans/me');
}

export function uploadBook(formData) {
    return postForm('/api/books/upload', formData, true);
}

export async function exportMyLoans() {
    const {blob, filename} = await getBlob('/api/loans/export', 'my_loans.csv');

    const a = document.createElement('a');
    const href = URL.createObjectURL(blob);
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
}

export function addFavorite(bookId) {
    return post(`/api/books/${bookId}/favorite/add`);
}

export function removeFavorite(bookId) {
    return post(`/api/books/${bookId}/favorite/remove`);
}

export function listFavorites() {
    return get(`/api/books/favorites`);
}