import {renderDropdownList, renderLoginState} from "./common.page";
import {qrySelector} from "../assets/js/util.js";

/**
 * 实现图片的上传预览
 *
 */
function addCoverImageListener() {
    const imageInput = qrySelector('#coverImage');
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (!file) return;

        //获取预览图和占位符
        const img = qrySelector('#preview-image');
        const placeholder = qrySelector('#placeholder');

        //把上传的图片转成URL显示
        img.src = URL.createObjectURL(file);
        img.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderLoginState();
    renderDropdownList();
    addCoverImageListener();
});