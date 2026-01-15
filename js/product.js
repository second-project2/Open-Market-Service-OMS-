// js/product.js (최종본 전체: 상품 로딩 + 수량 +/- + 비로그인 모달)

const API_BASE = "https://api.wenivops.co.kr/services/open-market";

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // ✅ product.html?id=101
}

function isLoggedIn() {
  // ✅ login.js 기준
  const token = localStorage.getItem("accessToken");
  return typeof token === "string" && token.trim().length > 0;
}

function formatPrice(num) {
  const n = Number(num);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("ko-KR");
}

/* ---------- state ---------- */
const state = {
  unitPrice: 0,
  stock: 1,
  quantity: 1,
};

/* ---------- DOM ---------- */
const els = {
  sellerName: document.getElementById("sellerName"),
  productName: document.getElementById("productName"),
  productPrice: document.getElementById("productPrice"),
  productImage: document.getElementById("productImage"),
  shippingInfo: document.getElementById("shippingInfo"),
  totalQty: document.getElementById("totalQty"),
  totalPrice: document.getElementById("totalPrice"),
  qtyValue: document.getElementById("qtyValue"),
  pageHint: document.getElementById("pageHint"),
};

const modalBackdrop = document.getElementById("loginModal");
const btnClose = modalBackdrop?.querySelector(".modal-close");
const btnCancel = modalBackdrop?.querySelector(".modal-btn.cancel");
const btnConfirm = modalBackdrop?.querySelector(".modal-btn.confirm");

const btnMinus = document.querySelector('[data-qty="minus"]');
const btnPlus = document.querySelector('[data-qty="plus"]');

/* ---------- modal ---------- */
function openModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.add("is-open");
  modalBackdrop.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("is-open");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

function goLogin() {
  window.location.href = "./login.html";
}

/* ---------- UI 업데이트 ---------- */
function updateQtyUI() {
  if (els.qtyValue) els.qtyValue.textContent = String(state.quantity);
  if (els.totalQty) els.totalQty.textContent = String(state.quantity);

  // 총 금액(상품가격 * 수량)
  const total = state.unitPrice * state.quantity;
  if (els.totalPrice) els.totalPrice.textContent = formatPrice(total);

  // 버튼 활성/비활성
  if (btnMinus) btnMinus.disabled = state.quantity <= 1;
  if (btnPlus) btnPlus.disabled = state.quantity >= state.stock;
}

/* ---------- 상품 로드 ---------- */
async function loadProduct() {
  const productId = getProductId();

  if (!productId) {
    if (els.pageHint) els.pageHint.textContent = "상품 id가 없습니다. 목록에서 다시 진입해주세요.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/products/${productId}/`);
    const data = await res.json();

    if (!res.ok) {
      window.location.href = "./error.html";
      return;
    }

    const seller =
      data?.seller?.store_name ||
      data?.seller?.name ||
      data?.seller?.username ||
      "판매자";

    const name = data?.name || "상품명";
    const price = Number(data?.price ?? 0);
    const stock = Number(data?.stock ?? 1);

    state.unitPrice = Number.isFinite(price) ? price : 0;
    state.stock = Number.isFinite(stock) && stock > 0 ? stock : 1;
    state.quantity = 1;

    // 배송 텍스트
    const shippingMethod = data?.shipping_method === "DELIVERY" ? "직접배송" : "택배배송";
    const shippingFee = Number(data?.shipping_fee ?? 0);
    const shippingText = shippingFee === 0 ? "무료배송" : `${formatPrice(shippingFee)}원`;

    if (els.sellerName) els.sellerName.textContent = seller;
    if (els.productName) els.productName.textContent = name;
    if (els.productPrice) els.productPrice.textContent = formatPrice(state.unitPrice);
    if (els.shippingInfo) els.shippingInfo.textContent = `${shippingMethod} / ${shippingText}`;

    // ✅ 이미지: 숨김 상태 복구 + 실패 시에만 처리
    if (els.productImage) {
      const imgUrl = data?.image || "";

      els.productImage.style.display = "";
      els.productImage.parentElement?.classList.remove("no-image");

      els.productImage.src = imgUrl;
      els.productImage.alt = name;

      els.productImage.onerror = () => {
        els.productImage.style.display = "none";
        els.productImage.parentElement?.classList.add("no-image");
      };
    }

    if (els.pageHint) {
      els.pageHint.textContent =
        state.stock <= 1 ? "재고가 적습니다." : `재고 ${state.stock}개`;
    }

    updateQtyUI();
  } catch (e) {
    window.location.href = "./error.html";
  }
}

/* ---------- 이벤트 ---------- */
document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;

  // 모달 닫기
  if (target === btnClose || target === btnCancel) {
    closeModal();
    return;
  }

  // 모달 예
  if (target === btnConfirm) {
    goLogin();
    return;
  }

  // 모달 바깥 클릭
  if (target === modalBackdrop) {
    closeModal();
    return;
  }

  // 수량 버튼
  const qtyBtn = target.closest("[data-qty]");
  if (qtyBtn) {
    const type = qtyBtn.getAttribute("data-qty");
    if (type === "minus" && state.quantity > 1) state.quantity -= 1;
    if (type === "plus" && state.quantity < state.stock) state.quantity += 1;
    updateQtyUI();
    return;
  }

  // 로그인 필요 버튼(장바구니/바로구매)
  const requires = target.closest("[data-requires-login='true']");
  if (!requires) return;

  if (!isLoggedIn()) {
    openModal();
  } else {
    // ✅ 로그인 상태: 지금 단계에서는 실제 동작 없음(UI/연동 준비)
  }
});

/* ---------- 실행 ---------- */
loadProduct();
