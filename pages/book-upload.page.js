import {renderDropdownList, renderLoginState} from "./common.page.js";
import {qrySelector, redirect2Login, showConfirmation, toast} from "../assets/js/util.js";
import {uploadBook} from "../assets/js/books.api.js";
import {isUserAuthed} from "../assets/js/auth.js";

// 提交中的标志位
let isSubmitting = false;

/**
 * 实现图片的上传预览
 *
 */
function addCoverImageListener() {
    //图片上传控件
    const imageInput = qrySelector('#coverImage');
    //预览图和占位符
    const img = qrySelector('#preview-image');
    const placeholder = qrySelector('#placeholder');

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (!file) {
            img.src = "";
            img.style.display = "none";
            placeholder.style.display = "block";
            return;
        }

        //把上传的图片转成URL显示
        img.src = URL.createObjectURL(file);
        img.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    });
}

function addFormListener() {
    const form = qrySelector('#bookForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmitForm(() => {
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        });
    });
}

function checkFormData(title, author, publisher, isbn, category, summary, coverFile) {
    if (!author) {
        toast("作者不能为空", "error");
        return false;
    }
    if (!publisher) {
        toast("出版社不能为空", "error");
        return false;
    }
    if (!isbn) {
        toast("ISBN不能为空", "error");
        return false;
    }
    if (!category) {
        toast("请选择分类", "error");
        return false;
    }
    if (!summary) {
        toast("内容简介不能为空", "error");
        return false;
    }
    if (!coverFile) {
        toast("请上传封面图片", "error");
        return false;
    }
    return true;
}

function setSubmittingState(form, submitting) {
    isSubmitting = submitting;

    // 禁用所有可交互元素
    form.querySelectorAll('input, textarea, button').forEach(el => {
        if (form.contains(el)) el.disabled = submitting;
    });
}

/**
 * 书籍上传表单处理
 *
 */
function handleSubmitForm(onSuccess) {
    if (!isUserAuthed()) {
        const redirectUrl = window.location.pathname;
        redirect2Login(redirectUrl);
        return;
    }

    const form = qrySelector("#bookForm");
    // 避免重复提交
    if (isSubmitting) return;

    const title = qrySelector("#title").value.trim();
    const author = qrySelector("#author").value.trim();
    const publisher = qrySelector("#publisher").value.trim();
    const isbn = qrySelector("#isbn").value.trim();
    const category = form.querySelector('input[name="category"]:checked');
    const summary = qrySelector("#summary").value.trim();
    const coverFile = qrySelector("#coverImage").files[0];

    if (!checkFormData(title, author, publisher, isbn, category, summary, coverFile)) {
        return;
    }

    showConfirmation(
        `确定要上传这本书吗？`,
        async () => {
            try {
                setSubmittingState(form, true);

                // 构造 formData
                const formData = new FormData();
                formData.append("title", title);
                formData.append("author", author);
                formData.append("publisher", publisher);
                formData.append("isbn", isbn);
                formData.append("categories", category.value);
                formData.append("summary", summary);
                formData.append("cover", coverFile);

                const res = await uploadBook(formData);
                if (res?.code === "OK") {
                    toast("上传成功", "success");
                    if (onSuccess) onSuccess();
                } else {
                    toast(res.message || "上传失败", "error");
                }
            } catch (err) {
                toast(err?.message || "上传失败", "error");
            } finally {
                setSubmittingState(form, false);
            }
        },
        () => {
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    renderLoginState();
    renderDropdownList();
    addCoverImageListener();
    addFormListener();
});