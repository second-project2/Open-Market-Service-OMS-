const API_BASE_URL = "https://api.wenivops.co.kr/services/open-market";

// URL에서 productId 가져오기
const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

// DOM 요소
const statusEl = document.getElementById("status");
const imgEl = document.getElementById("product-image");
const nameEl = document.getElementById("product-name");
const priceEl = document.getElementById("product-price");
const infoEl = document.getElementById("product-info");

const qtyEl = document.getElementById("quantity");
const totalEl = document.getElementById("total-price");
const minusBtn = document.getElementById("btn-minus");
const plusBtn = document.getElementById("btn-plus");

// 수량 상태
let quantity = 1;

// productId 없을 때
if (!productId) {
  statusEl.textContent = "productId가 없습니다. 주소에 ?productId=1 을 붙여주세요.";
} else {
  fetchProductDetail(productId);
}

// 상품 상세 API 호출
async function fetchProductDetail(id) {
  try {
    statusEl.textContent = "상품 정보를 불러오는 중입니다...";

    const res = await fetch(`${API_BASE_URL}/products/${id}/`);

    if (!res.ok) {
      statusEl.textContent = `상품을 불러오지 못했습니다. (status: ${res.status})`;
      return;
    }

    const data = await res.json();
    console.log("상품 상세 응답:", data);

    // 화면 렌더링
    statusEl.style.display = "none";

    nameEl.textContent = data.name;
    priceEl.textContent = `${data.price.toLocaleString()}원`;
    infoEl.textContent = data.info;

    if (data.image) {
      imgEl.src = data.image;
      imgEl.alt = data.name;
      imgEl.style.display = "block";
    }

    // 초기 수량/총액
    qtyEl.textContent = quantity;

    function renderTotal() {
      const total = data.price * quantity + data.shipping_fee;
      totalEl.textContent = `${total.toLocaleString()}원`;
    }

    renderTotal();

    // 수량 감소
    minusBtn.addEventListener("click", () => {
      if (quantity <= 1) return;
      quantity -= 1;
      qtyEl.textContent = quantity;
      renderTotal();
    });

    // 수량 증가
    plusBtn.addEventListener("click", () => {
      quantity += 1;
      qtyEl.textContent = quantity;
      renderTotal();
    });
  } catch (error) {
    console.error(error);
    statusEl.textContent = "오류가 발생했습니다. 콘솔을 확인해주세요.";
  }
}
