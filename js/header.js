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
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;
    
    const loginToken = localStorage.getItem('login-token');
    const userRole = localStorage.getItem('user-role'); 
  
    if (loginToken) {
        // [로그인 후 상태]
        if (userRole === 'seller') {
            // 판매자로 로그인했을 때
            userMenu.innerHTML = `
                <div class="menu-item" onclick="location.href='mypage.html'">
                    <img src="../assets/icons/icon-user.svg" alt="mypage">
                    <span>마이페이지</span>
                </div>
                <div class="menu-item seller-center" onclick="location.href='seller-center.html'">
                    <img src="../assets/icons/icon-shopping-bag.svg" alt="seller center">
                    <span>판매자 센터</span>
                </div>
            `;
        } else {
            // 일반 구매자로 로그인했을 때
            userMenu.innerHTML = `
                <div class="menu-item" onclick="location.href='cart.html'">
                    <img src="../assets/icons/icon-shopping-cart.svg" alt="cart">
                    <span>장바구니</span>
                </div>
                <div class="menu-item" onclick="location.href='mypage.html'">
                    <img src="../assets/icons/icon-user.svg" alt="mypage">
                    <span>마이페이지</span>
                </div>
            `;
        }
    } else {
        // [로그인 전 상태]
        userMenu.innerHTML = `
            <div class="menu-item" onclick="location.href='cart.html'">
                <img src="../assets/icons/icon-shopping-cart.svg" alt="cart">
                <span>장바구니</span>
            </div>
            <div class="menu-item" onclick="location.href='login.html'">
                <img src="../assets/icons/icon-user.svg" alt="login">
                <span>로그인</span>
            </div>
        `;
    }
}

function handleSearch() {
    const searchInput = document.querySelector('.search-container input');
    const keyword = searchInput.value.trim();

    if (keyword) {
        // 검색어를 URL 파라미터로 전달하며 메인 페이지로 이동
        location.href = `index.html?search=${keyword}`;
    } else {
        alert("검색어를 입력해주세요!");
        searchInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    updateNavigation();
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});
