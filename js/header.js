import { openLoginModal, setupModalEvents } from './modal.js';

async function loadLayout() {
    const headerElement = document.getElementById('main-header'); //
    if (headerElement) {
        const res = await fetch('./header.html');
        const data = await res.text();
        headerElement.innerHTML = data;
    }

    const footerElement = document.getElementById('common-footer'); //
    if (footerElement) {
        const res = await fetch('./footer.html');
        const data = await res.text();
        footerElement.innerHTML = data;
    }
}

function updateNavigation() {
    const userAccountBtn = document.getElementById('userAccountBtn');
    const userText = document.getElementById('userText');
    const userIcon = document.getElementById('userIcon');
    const dropdown = document.getElementById('myPageDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const cartBtn = document.querySelector('.menu-item img[alt="cart"]')?.parentElement;

    const loginToken = localStorage.getItem('accessToken');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userRole = userInfo.user_type; 

    if (!userAccountBtn) return; 

    // 
    // 2. 장바구니 클릭 로직 (로그인 체크)
    // 
    if (cartBtn) {
        cartBtn.onclick = (e) => {
            if (!loginToken) {
                e.preventDefault(); 
                openLoginModal();   
            } else {
                location.href = 'cart.html'; 
            }
        };
    }
   if (loginToken) {
        userText.innerText = "마이페이지";
        userAccountBtn.onclick = (e) => {
            e.stopPropagation(); 
            const isOpen = dropdown.classList.toggle('show'); 
            userIcon.src = isOpen ? "../assets/icons/icon-user-2.svg" : "../assets/icons/icon-user.svg";
        };
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.stopPropagation(); 
                if (confirm("로그아웃 하시겠습니까?")) {
                    localStorage.clear(); 
                    location.href = 'index.html'; 
                } // ✅ 빠졌던 중괄호 추가
            };
        }
    } else {
        // [비로그인 상태]
        userText.innerText = "로그인";
        userIcon.src = "../assets/icons/icon-user.svg";
        userAccountBtn.onclick = () => {
            location.href = 'login.html';
        };
        if (dropdown) dropdown.classList.remove('show');
    }
    setupModalEvents();
}

// 화면 클릭 시 드롭다운 닫기
document.addEventListener('click', () => {
    const dropdown = document.getElementById('myPageDropdown');
    const userIcon = document.getElementById('userIcon');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        if (userIcon) userIcon.src = "../assets/icons/icon-user.svg";
    }
});

function handleSearch() {
    const searchInput = document.querySelector('.search-container input');
    if (!searchInput) return;
    const keyword = searchInput.value.trim();

    if (keyword) {
        location.href = `index.html?search=${keyword}`;
    } else {
        alert("검색어를 입력해주세요!");
        searchInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout(); // 헤더/푸터 먼저 로드
    updateNavigation(); // 로드된 요소에 기능 연결
    
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
});

