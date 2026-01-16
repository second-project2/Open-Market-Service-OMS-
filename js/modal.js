// js/modal.js

export function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }
}

export function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }
}

export function setupModalEvents() {
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalBackdrop = document.getElementById('loginModal');

    // ✅ ?. 대신 if 문을 사용하여 안전하게 이벤트를 연결합니다.
    if (modalClose) {
        modalClose.onclick = () => closeLoginModal();
    }

    if (modalCancel) {
        modalCancel.onclick = () => closeLoginModal();
    }

    if (modalConfirm) {
        modalConfirm.onclick = () => {
            closeLoginModal();
            // index.html이 html 폴더 안에 있다면 ./login.html이 맞습니다.
            window.location.href = "./login.html";
        };
    }

    if (modalBackdrop) {
        modalBackdrop.onclick = (e) => {
            if (e.target === modalBackdrop) closeLoginModal();
        };
    }
}