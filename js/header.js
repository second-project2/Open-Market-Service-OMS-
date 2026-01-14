/**
 * 네비게이션 바 상태를 관리하는 함수
 */
function updateNavigation() {
    const userMenu = document.querySelector('.user-menu');
    
    // 로그인 상태 확인 (실제로는 서버와 통신하거나 토큰을 확인합니다)
    // 여기서는 테스트를 위해 localStorage를 사용합니다.
    const loginToken = localStorage.getItem('login-token');
    const userRole = localStorage.getItem('user-role'); // 'buyer' 또는 'seller'

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

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', updateNavigation);