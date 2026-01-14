document.addEventListener('DOMContentLoaded', () => {
    const goMainBtn = document.querySelector('.btn-go-main');
    if (goMainBtn) {
        goMainBtn.addEventListener('click', () => {
            location.href = 'index.html';
        });
    }

    const goBackBtn = document.querySelector('.btn-go-back');
    if (goBackBtn) {
        goBackBtn.addEventListener('click', () => {
            history.back();
        });
    }
});