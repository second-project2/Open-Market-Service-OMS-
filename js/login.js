const form = document.querySelector('.login-form');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const userID = document.getElementById('user-id').value.trim();
  const userPassword = document.getElementById('user-password').value.trim();

  const userType =
    document.querySelector('input[name="user-type"]:checked')?.value
    || 'BUYER';

  if (!userID && !userPassword) {
    errorMsg.innerText = '아이디와 비밀번호를 입력해 주세요';
    document.getElementById('user-id').focus();
    return;
  }

  if (!userID) {
    errorMsg.innerText = '아이디를 입력해 주세요';
    document.getElementById('user-id').focus();
    return;
  }

  if (!userPassword) {
    errorMsg.innerText = '비밀번호를 입력해 주세요';
    document.getElementById('user-password').focus();
    return;
  }

  try {
    const response = await fetch(
      'https://api.wenivops.co.kr/services/open-market/accounts/login/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userID,
          password: userPassword,
          login_type: userType,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorMsg.innerText = '아이디 또는 비밀번호가 일치하지 않습니다.';
      document.getElementById('user-password').value = '';
      document.getElementById('user-password').focus();
      return;
    }

    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('userInfo', JSON.stringify(data.user));

    window.location.href = './index.html';

  } catch (error) {
    console.error(error);
    window.location.href = './error.html';
  }
});
