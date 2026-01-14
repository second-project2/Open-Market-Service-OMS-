document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnCheckId = document.getElementById('btnCheckId');

    // 유효성 검사가 필요한 모든 입력 필드 선택
    // required 속성이 있는 input, select 태그들
    const requiredFields = form.querySelectorAll('input[required], select[required]');

    // 중복확인 버튼 클릭 이벤트
    btnCheckId.addEventListener('click', () => {
        const userId = document.getElementById('user-id').value;
        if (!userId) {
            alert('아이디를 입력해주세요.');
        } else {
            // 실제로는 서버에 중복확인 요청을 보내야 합니다.
            alert('사용 가능한 아이디입니다. (더미)');
        }
    });

    // 폼 유효성 검사 함수
    function checkValidity() {
        let isFormValid = true;

        // 1. 모든 필수 입력 필드에 값이 있는지 확인
        requiredFields.forEach(field => {
            if (field.type === 'checkbox') {
                // 체크박스는 체크 여부 확인
                if (!field.checked) {
                    isFormValid = false;
                }
            } else {
                // 일반 입력창은 값이 비어있는지 확인
                if (!field.value.trim()) {
                    isFormValid = false;
                }
            }
        });

        // TODO: 여기에 비밀번호 일치 여부, 정규식 검사 등을 추가할 수 있습니다.

        // 2. 유효성 결과에 따라 가입하기 버튼 활성화/비활성화 처리
        if (isFormValid) {
            btnSubmit.disabled = false; // 버튼 활성화 (초록색)
        } else {
            btnSubmit.disabled = true; // 버튼 비활성화 (회색)
        }
    }

    // 모든 필수 입력 필드에 이벤트 리스너 연결
    // 값이 변할 때마다(input, change) checkValidity 함수 실행
    requiredFields.forEach(field => {
        field.addEventListener('input', checkValidity);
        field.addEventListener('change', checkValidity);
    });

    // 폼 제출 이벤트 처리 (새로고침 방지 및 최종 확인)
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // 기본 제출 동작 막기
        
        // 최종적으로 한 번 더 검사 (혹시 모를 상황 대비)
        if (!btnSubmit.disabled) {
            alert('회원가입이 완료되었습니다! (더미)');
            // 실제로는 여기서 서버로 데이터를 전송합니다.
            // form.submit(); 
        }
    });
});