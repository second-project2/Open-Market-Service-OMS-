// ==============================
// mypage.js (임시 상품상세 작업)
// ==============================

const API_BASE_URL = "https://api.wenivops.co.kr/services/open-market";

// 1) URL에서 productId 가져오기
const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

// 2) DOM 요소 가져오기
const statusEl = document.getElementById("status");

const imgEl = document.getElementById("productImage");
const nameEl = document.getElementById("productName");
const sellerEl = document.getElementById("sellerName");
const priceEl = document.getElementById("productPrice");
const shipTextEl = document.getElementById("shippingText");
const descEl = document.getElementById("productDesc");

const qtyEl = document.getElementById("quantity");
const totalQtyEl = document.getElementById("total-qty");
const totalEl = document.getElementById("total-price");

const minusBtn = document.getElementById("btn-minus");
const plusBtn = document.getElementById("btn-plus");

const cartBtn = document.getElementById("btn-cart");
const buyBtn = document.getElementById("btn-buy");

// 모달(있으면 연결됨)
const loginModal = document.getElementById("loginModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");

// 3) 상태값
let quantity = 1;
let currentProduct = null;

// ------------------------------------
// 유틸: 상태 메시지 표시
// ------------------------------------
function showStatus(msg) {
  if (!statusEl) return;
  statusEl.style.display = "block";
  statusEl.textContent = msg;
}

function hideStatus() {
  if (!statusEl) return;
  statusEl.style.display = "none";
}

// ------------------------------------
// 유틸: 숫자 표시
// ------------------------------------
function formatWon(n) {
  return Number(n ?? 0).toLocaleString();
}

// ------------------------------------
// 유틸: 버튼 잠금
// ------------------------------------
function lockAllButtons() {
  if (minusBtn) minusBtn.disabled = true;
  if (plusBtn) plusBtn.disabled = true;
  if (cartBtn) cartBtn.disabled = true;
  if (buyBtn) buyBtn.disabled = true;
}

// ------------------------------------
// (선택) 로그인 모달 열기/닫기
// 팀 공통 로그인 판단은 보통 common.js에서 함.
// 여기서는 "열기 기능"만 준비.
// ------------------------------------
function openLoginModal() {
  if (!loginModal) return;
  loginModal.classList.remove("hidden");
  loginModal.setAttribute("aria-hidden", "false");
}

function closeLoginModal() {
  if (!loginModal) return;
  loginModal.classList.add("hidden");
  loginModal.setAttribute("aria-hidden", "true");
}

// 모달 이벤트 연결(있을 때만)
if (modalBackdrop) modalBackdrop.addEventListener("click", closeLoginModal);
if (modalClose) modalClose.addEventListener("click", closeLoginModal);
if (modalCancel) modalCancel.addEventListener("click", closeLoginModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLoginModal();
});

// ------------------------------------
// 장바구니(LocalStorage) - 중복 방지
// ------------------------------------
function getCart() {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// "이미 선택된 상품 다시 선택 -> 추가되지 않음" 충족
function addToCartOnce(product, qty, priceNum, shipNum) {
  const cart = getCart();

  const exists = cart.some((item) => String(item.productId) === String(product.id));
  if (exists) {
    alert("이미 장바구니에 담긴 상품입니다.");
    return;
  }

  cart.push({
    productId: product.id,
    name: product.name,
    image: product.image,
    price: priceNum,
    shippingFee: shipNum,
    quantity: qty,
  });

  setCart(cart);
  alert("장바구니에 담았습니다.");
}

// ------------------------------------
// 렌더: 수량/총액/버튼 상태 업데이트
// ------------------------------------
function renderQuantity() {
  if (qtyEl) qtyEl.textContent = String(quantity);
  if (totalQtyEl) totalQtyEl.textContent = String(quantity);
}

function renderTotal(priceNum, shipNum) {
  // 배송비는 "표시 X", 총액 계산에만 반영
  const total = priceNum * quantity + shipNum;
  if (totalEl) totalEl.textContent = formatWon(total);
}

function updateQtyButtons(stock) {
  if (!minusBtn || !plusBtn) return;

  // - 버튼: 최소 1 유지
  minusBtn.disabled = quantity <= 1;

  // + 버튼: 재고 초과 방지
  if (stock <= 0) {
    plusBtn.disabled = true;
    return;
  }
  plusBtn.disabled = quantity >= stock;
}

// ------------------------------------
// 상품 상세 불러오기 + 화면 렌더링
// ------------------------------------
async function fetchProductDetail(id) {
  try {
    showStatus("상품 정보를 불러오는 중입니다...");

    const res = await fetch(`${API_BASE_URL}/products/${id}/`);
    if (!res.ok) {
      showStatus(`상품을 불러오지 못했습니다. (status: ${res.status})`);
      lockAllButtons();
      return;
    }

    const data = await res.json();
    console.log("상품 상세 응답:", data);

    currentProduct = data;

    const priceNum = Number(data.price ?? 0);
    const shipNum = Number(data.shipping_fee ?? 0);
    const stock = Number(data.stock ?? 0);

    // ---- 화면에 데이터 렌더링 ----
    hideStatus();

    if (nameEl) nameEl.textContent = data.name ?? "-";
    if (sellerEl) sellerEl.textContent = data.seller?.store_name ?? "-";

    if (priceEl) priceEl.textContent = formatWon(priceNum);
    if (descEl) descEl.textContent = data.info ?? "-";

    if (shipTextEl) {
      shipTextEl.textContent = shipNum === 0 ? "택배배송 / 무료배송" : "택배배송";
    }

    if (imgEl && data.image) {
      imgEl.src = data.image;
      imgEl.alt = data.name ?? "상품 이미지";
      imgEl.style.display = "block";
    }

    // ---- 재고 0이면 품절 처리 ----
    if (stock <= 0) {
      showStatus("품절 상품입니다.");
      if (plusBtn) plusBtn.disabled = true;
      if (cartBtn) cartBtn.disabled = true;
      if (buyBtn) buyBtn.disabled = true;
    }

    // ---- 수량/총액/버튼 초기 렌더 ----
    quantity = 1;
    renderQuantity();
    renderTotal(priceNum, shipNum);
    updateQtyButtons(stock);

    // --------------------------------
    // 이벤트 연결
    // --------------------------------
    if (minusBtn) {
      minusBtn.onclick = () => {
        if (quantity <= 1) return;
        quantity -= 1;
        renderQuantity();
        renderTotal(priceNum, shipNum);
        updateQtyButtons(stock);
      };
    }

    if (plusBtn) {
      plusBtn.onclick = () => {
        if (stock <= 0) return;
        if (quantity >= stock) return;
        quantity += 1;
        renderQuantity();
        renderTotal(priceNum, shipNum);
        updateQtyButtons(stock);
      };
    }

    // ✅ 장바구니 버튼: 중복 추가 방지
    if (cartBtn) {
      cartBtn.onclick = () => {
        // 로그인 체크는 팀 공통으로 붙일 예정이라 "자리"만 둠
        // 예: if (!isLoggedIn()) { openLoginModal(); return; }

        if (!currentProduct) return;
        if (stock <= 0) {
          alert("품절 상품입니다.");
          return;
        }
        addToCartOnce(currentProduct, quantity, priceNum, shipNum);
      };
    }

    // ✅ 바로구매 버튼: 지금은 동작 확인용
    if (buyBtn) {
      buyBtn.onclick = () => {
        // 예: if (!isLoggedIn()) { openLoginModal(); return; }

        if (!currentProduct) return;
        if (stock <= 0) {
          alert("품절 상품입니다.");
          return;
        }
        alert(`바로구매(임시): ${currentProduct.name} / 수량 ${quantity}`);
      };
    }
  } catch (err) {
    console.error(err);
    showStatus("오류가 발생했습니다. 콘솔을 확인해주세요.");
    lockAllButtons();
  }
}

// ------------------------------------
// 시작
// ------------------------------------
if (!productId) {
  showStatus("productId가 없습니다. 주소에 ?productId=1 을 붙여주세요.");
  lockAllButtons();
} else {
  fetchProductDetail(productId);
}