document.addEventListener('DOMContentLoaded', () => {
    // 1. 요소 가져오기
    const inputs = {
        id: document.getElementById('user-id'),
        pw: document.getElementById('user-pw'),
        pwCheck: document.getElementById('user-pw-check'),
        name: document.getElementById('user-name'),
        phoneFirst: document.getElementById('phone-first'),
        phoneMiddle: document.getElementById('phone-middle'),
        phoneLast: document.getElementById('phone-last'),
        agreePolicy: document.getElementById('agree-policy'), // 약관 체크박스
    };
    
    const msgs = {
        id: document.getElementById('id-message'),
        pw: document.getElementById('pw-message'),
        pwCheck: document.getElementById('pw-check-message'),
    };

    const icons = {
        pw: document.getElementById('pw-icon'),
        pwCheck: document.getElementById('pw-check-icon'),
    };

    const btnCheckId = document.getElementById('btnCheckId');
    const form = document.querySelector('.signup-form');
    const btnSubmit = document.querySelector('.btn-signup-submit');

    // 상태 변수
    let isIdValid = false;

    // --- 유틸리티 함수 ---
    function showMsg(element, msg, type) {
        element.textContent = msg;
        element.classList.add('on');
        element.classList.remove('error', 'success');
        element.classList.add(type);
    }
    
    function hideMsg(element) {
        element.textContent = '';
        element.classList.remove('on', 'error', 'success');
    }

    // --------------------------------------------------------
    // 1. 아이디 유효성 검사 및 중복확인
    // --------------------------------------------------------
    const validateIdFormat = () => {
        const id = inputs.id.value;
        const regex = /^[a-z0-9]{4,20}$/i; // 영문+숫자 4~20자

        if (!id) {
            showMsg(msgs.id, '필수 정보입니다.', 'error');
            return false;
        }
        if (!regex.test(id)) {
            showMsg(msgs.id, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.', 'error');
            return false;
        }
        hideMsg(msgs.id);
        return true;
    };

    inputs.id.addEventListener('blur', validateIdFormat);
    inputs.id.addEventListener('input', () => {
        isIdValid = false;
        btnSubmit.disabled = true; // 아이디 바뀌면 버튼 비활성화
        inputs.id.classList.remove('error');
    });

    btnCheckId.addEventListener('click', async () => {
        if (!validateIdFormat()) return;

        try {
            // [API] 아이디 중복 확인
            const res = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/validate-username/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: inputs.id.value }),
            });
            const json = await res.json();

            if (res.ok) {
                showMsg(msgs.id, '멋진 아이디네요 :)', 'success');
                isIdValid = true;
                checkAllValidity();
            } else {
                showMsg(msgs.id, json.message || json.error || '이미 사용 중인 아이디입니다.', 'error');
                isIdValid = false;
            }
        } catch (err) {
            console.error(err);
            alert('서버 통신 오류');
        }
    });

    // --------------------------------------------------------
    // 2. 비밀번호 유효성 검사
    // --------------------------------------------------------
    const validatePw = () => {
        const pw = inputs.pw.value;
        // 8자 이상, 영문/숫자/특수문자 포함
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

        if (!pw) {
            icons.pw.classList.remove('active');
            return false;
        }
        
        if (regex.test(pw)) {
            hideMsg(msgs.pw);
            icons.pw.classList.add('active'); // 아이콘 보이기
            return true;
        } else {
            showMsg(msgs.pw, '8자 이상, 영문 소문자, 숫자, 특수문자를 사용하세요.', 'error');
            icons.pw.classList.remove('active');
            return false;
        }
    };

    inputs.pw.addEventListener('blur', () => {
        if (!inputs.pw.value) showMsg(msgs.pw, '필수 정보입니다.', 'error');
        else validatePw();
    });
    inputs.pw.addEventListener('input', validatePw);


    // --------------------------------------------------------
    // 3. 비밀번호 재확인 검사
    // --------------------------------------------------------
    const validatePwCheck = () => {
        const pw = inputs.pw.value;
        const pwCheck = inputs.pwCheck.value;

        if (pwCheck === pw && pwCheck.length > 0) {
            hideMsg(msgs.pwCheck);
            icons.pwCheck.classList.add('active'); // 아이콘 보이기
            return true;
        } else if (pwCheck.length > 0) {
            showMsg(msgs.pwCheck, '비밀번호가 일치하지 않습니다.', 'error');
            icons.pwCheck.classList.remove('active');
            return false;
        }
        return false;
    };

    inputs.pwCheck.addEventListener('blur', () => {
         if (!inputs.pwCheck.value) showMsg(msgs.pwCheck, '필수 정보입니다.', 'error');
         else validatePwCheck();
    });
    inputs.pwCheck.addEventListener('input', validatePwCheck);


    // --------------------------------------------------------
    // 4. 가입하기 버튼 활성화 체크 (약관 동의 포함!)
    // --------------------------------------------------------
    function checkAllValidity() {
        if (isIdValid && 
            validatePw() && 
            validatePwCheck() && 
            inputs.name.value && 
            inputs.phoneMiddle.value && 
            inputs.phoneLast.value &&
            inputs.agreePolicy.checked // ★ 체크박스 확인 ★
           ) {
            btnSubmit.disabled = false; // 버튼 활성화 (초록색)
        } else {
            btnSubmit.disabled = true;  // 버튼 비활성화 (회색)
        }
    }

    // 폼 내부 어디서든 입력이 발생하면 유효성 재검사
    form.addEventListener('input', checkAllValidity);


    // --------------------------------------------------------
    // 5. 최종 회원가입 요청
    // --------------------------------------------------------
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phone = `${inputs.phoneFirst.value}${inputs.phoneMiddle.value}${inputs.phoneLast.value}`;

        try {
            // [API] 구매자 회원가입
            const res = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/buyer/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: inputs.id.value,
                    password: inputs.pw.value,
                    name: inputs.name.value,
                    phone_number: phone
                }),
            });
            
            const json = await res.json();

            if (res.ok) {
                alert('회원가입 성공!');
                location.href = './login.html';
            } else {
                // 에러 처리
                let errorText = json.error_message || json.message || '가입 실패';
                if(json.phone_number) errorText = json.phone_number[0];
                if(json.username) errorText = json.username[0];
                
                alert(errorText);
            }

        } catch (err) {
            console.error(err);
            alert('서버 연결 실패');
        }
    });
});