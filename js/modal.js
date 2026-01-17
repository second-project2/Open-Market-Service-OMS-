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

    if (modalClose) {
        modalClose.onclick = () => closeLoginModal();
    }

    if (modalCancel) {
        modalCancel.onclick = () => closeLoginModal();
    }

    if (modalConfirm) {
        modalConfirm.onclick = () => {
            closeLoginModal();
            window.location.href = "./login.html";
        };
    }

    if (modalBackdrop) {
        modalBackdrop.onclick = (e) => {
            if (e.target === modalBackdrop) closeLoginModal();
        };
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLoginModal();
        }
    });
}