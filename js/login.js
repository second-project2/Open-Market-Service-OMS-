// **1) 로그인 페이지**

// - 아이디와 비밀번호가 일치하지 않거나, 아이디나 비밀번호를 입력하지 않은 채 로그인 버튼을 누르면 경고 문구가 나타납니다.
// - 입력 창 아래에 경고창이 나타나면 로그인 버튼을 눌러도 로그인 되지 않습니다.
// - 입력 창에 입력이 안된 부분이 존재한 채로 로그인 버튼을 누르면 입력되지 않은 입력 창에 focus 이벤트가 작동하고 로그인은 되지 않습니다.
// - 아이디나 비밀번호가 일치하지 않는다면, 비밀번호 입력창에 focus이벤트가 발생하고 빈칸이 됩니다.
// - 로그인이 성공할 시, 로그인하기 이전 페이지로 이동합니다.
// - 구매자 : 구매 회원 로그인 탭을 클릭하면 구매 회원으로 로그인합니다.

// [로그인] 버튼 클릭 오류 메시지 
 
// 아이디, 비밀번호 입력란 모두 공란일 경우, 비밀번호만 입력했을 경우 : 아이디를 입력해 주세요.
// 아이디만 입력했을 경우 : 비밀번호를 입력해 주세요.
// 아이디, 비밀번호가 일치하지 않을 경우 : 아이디 또는 비밀번호가 일치하지 않습니다.

// 변수:아이디,비밀번호,로그인버튼,에러창
// 공란 " " (&&),일치 === ,로그인 성공시

const errorMsg=document.getElementById('errorMsg');
const loginBtn=document.querySelector('button');

loginBtn.addEventListener(('click'),function(event){
    event.preventDefault();

    const userID=document.getElementById('user-id').value;
    const userPassword=document.getElementById('user-password').value;
    if(userID===""&&userPassword==""){
        errorMsg.innerText="아이디와 비밀번호를 입력해  주세요"
        document.getElementById('user-id').focus();
        return;
    }else if(userID===""){
         errorMsg.innerText="아이디를 입력해  주세요"
        document.getElementById('user-id').focus();
        return;
    }else if(userPassword===""){
         errorMsg.innerText="비밀번호를 입력해  주세요"
        document.getElementById('user-password').focus();
        return;
    }else if(userID!==userPassword){
        errorMsg.innerText="아이디 또는 비밀번호가 일치하지 않습니다"
        document.getElementById('user-id').focus();
        return;
    }else{
        window.location.href="./index.html"
    }
});


