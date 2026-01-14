const errorMsg = document.getElementById('errorMsg');
const loginBtn = document.querySelector('button');

loginBtn.addEventListener('click', async function(event) {
    event.preventDefault();
    
    const userID = document.getElementById('user-id').value.trim();
    const userPassword = document.getElementById('user-password').value.trim();
    const userType = document.querySelector('input[name="user-type"]:checked')?.value || 'BUYER';
    
    if (!userID && !userPassword) {
        errorMsg.innerText = "아이디와 비밀번호를 입력해 주세요";
        document.getElementById('user-id').focus();
        return;
    } else if (!userID) {
        errorMsg.innerText = "아이디를 입력해 주세요";
        document.getElementById('user-id').focus();
        return;
    } else if (!userPassword) {
        errorMsg.innerText = "비밀번호를 입력해 주세요";
        document.getElementById('user-password').focus();
        return;
    }
    
    try {
        const response = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userID, password: userPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            errorMsg.innerText = data.error || "로그인에 실패했습니다.";
            document.getElementById('user-password').value = '';
            document.getElementById('user-password').focus();
            return;
        }
        
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        
        // 로그인 성공하면 index.html로 이동
        window.location.href = './index.html';
        
    } catch (err) {
        console.error(err);
        errorMsg.innerText = "서버와 통신 중 오류가 발생했습니다.";
        // 서버 오류 페이지로 이동
        window.location.href = './error.html';
    }
});