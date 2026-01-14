// 1. 필요한 요소들 가져오기
const banner = document.querySelector('.banner-section');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;
const totalSlides = slides.length;

function updateSlider() {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
}
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
});
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
});
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
    });
});
// 6. (선택사항) 5초마다 자동으로 슬라이드 넘기기
setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
}, 5000);

const API_URL = "https://api.wenivops.co.kr/services/open-market/products/";

async function fetchProducts() {
    const productList = document.getElementById("productList");
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        productList.innerHTML = "";

        // data.results 안에 든 상품들을 하나씩 꺼냅니다.
        data.results.forEach(item => {
            const li = document.createElement("li");
            li.className = "product-card";

            // 서버 응답(Res) 구조에 맞춰 데이터를 매칭합니다.
            li.innerHTML = `
                <div class="product-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <p class="seller-name">${item.seller.store_name}</p> 
                <p class="product-name">${item.name}</p>
                <p class="product-price">${item.price.toLocaleString()}<span>원</span></p>
            `;
            productList.appendChild(li);
        });
    } catch (error) {
        console.error("에러 발생:", error);
    }
}
fetchProducts();