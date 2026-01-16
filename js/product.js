// js/product.js 
import { openLoginModal } from './modal.js';
const API_BASE = "https://api.wenivops.co.kr/services/open-market";

function getProductIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || params.get("productId");
}

function formatNumber(n) {
  return Number(n).toLocaleString("ko-KR");
}

function isLoggedIn() {
  // ✅ 로그인 판별: login.js에서 저장한 키 사용
  return !!localStorage.getItem("accessToken");
}

async function fetchProduct(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "상품 조회 실패");
  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  // ===== 요소 잡기 =====
  const productImage = document.getElementById("productImage");
  const sellerName = document.getElementById("sellerName");
  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const shippingInfo = document.getElementById("shippingInfo");

  const qtyValue = document.getElementById("qtyValue");
  const totalQty = document.getElementById("totalQty");
  const totalPrice = document.getElementById("totalPrice");

  const plusBtn = document.querySelector('[data-qty="plus"]');
  const minusBtn = document.querySelector('[data-qty="minus"]');

  const loginRequiredBtns = document.querySelectorAll("[data-requires-login='true']");
  const hint = document.getElementById("pageHint");

  // ===== 안전장치 =====
  if (!plusBtn || !minusBtn || !qtyValue) {
    console.error("❌ 수량 버튼 요소를 찾지 못했습니다. (data-qty/qtyValue 확인)");
    return;
  }

  // ===== 상품 불러오기 =====
  const productId = getProductIdFromQuery();
  if (!productId) {
    if (hint) hint.textContent = "상품 id가 없습니다. 목록에서 다시 진입해주세요.";
    return;
  }

  let unitPrice = 0;
  let shippingFee = 0;
  let stock = 999999;

  try {
    const product = await fetchProduct(productId);

    sellerName.textContent = product?.seller?.store_name || product?.seller?.name || "판매자";
    productName.textContent = product?.name || "상품명";
    unitPrice = Number(product?.price || 0);
    shippingFee = Number(product?.shipping_fee || 0);
    stock = Number(product?.stock ?? 999999);

    productPrice.textContent = formatNumber(unitPrice);

    // ✅ 택배배송/배송비 표시 (API 응답값 shipping_fee 기반)
    shippingInfo.textContent = `택배배송 / ${formatNumber(shippingFee)}원`;

    // 이미지
    if (product?.image) {
      productImage.src = product.image;
      productImage.alt = product.name ? `${product.name} 이미지` : "상품 이미지";
    } else {
      productImage.removeAttribute("src");
      productImage.alt = "상품 이미지 없음";
    }

    // 초기 총액 계산
    const initQty = Number(qtyValue.textContent) || 1;
    totalQty.textContent = initQty;
    totalPrice.textContent = formatNumber(unitPrice * initQty);

    if (hint) hint.textContent = `재고 ${formatNumber(stock)}개`;
  } catch (e) {
    console.error(e);
    if (hint) hint.textContent = "상품 정보를 불러오지 못했습니다.";
    return;
  }

  // ===== 수량 변경 + 총액 업데이트 =====
  function updateTotals(nextQty) {
    qtyValue.textContent = String(nextQty);
    totalQty.textContent = String(nextQty);
    totalPrice.textContent = formatNumber(unitPrice * nextQty);
  }

  plusBtn.addEventListener("click", () => {
    const current = Number(qtyValue.textContent) || 1;
    if (current >= stock) return; // 재고 초과 방지
    updateTotals(current + 1);
  });

  minusBtn.addEventListener("click", () => {
    const current = Number(qtyValue.textContent) || 1;
    if (current <= 1) return; // 1 미만 방지
    updateTotals(current - 1);
  });

  loginRequiredBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("버튼 클릭됨!");
      if (!isLoggedIn()) {
        // 비로그인이면 modal.js에서 가져온 공통 모달 열기 실행
        openLoginModal();
        return;
      }
      // 로그인 상태일 때
      alert("로그인 상태입니다. 장바구니에 담겼습니다.");
    });
  });

  // ⚠️ [전체 삭제] 기존 코드 하단에 있던 '모달 닫기/이동/바깥 클릭' 
  // 관련 이벤트 리스너들은 모두 지웠습니다.
});