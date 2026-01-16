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
    const bannerSection = document.querySelector('.banner-section');

    // [추가] 주소창에서 검색어(?search=값) 가져오기
    const params = new URLSearchParams(location.search);
    const searchKeyword = params.get('search');

    let API_URL = "https://api.wenivops.co.kr/services/open-market/products/";
    
    if (searchKeyword) {
        if (bannerSection) bannerSection.style.display = 'none';
        API_URL = `${API_URL}?search=${encodeURIComponent(searchKeyword)}`;
    } else {
        if (bannerSection) bannerSection.style.display = 'block';
    }
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        productList.innerHTML = "";

        if (data.results.length === 0) {
            productList.innerHTML = `<li class="no-result" style="width:100%; text-align:center; padding: 100px 0;">
                찾으시는 상품이 없습니다.
                </li>`;
            return;
        }

        data.results.forEach(item => {
            const li = document.createElement("li");
            li.className = "product-card";
            li.innerHTML = `
                <a href="./product.html?id=${item.id}" class="product-link">
                <div class="product-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <p class="seller-name">${item.seller.store_name}</p> 
                <p class="product-name">${item.name}</p>
                <p class="product-price">${item.price.toLocaleString()}<span>원</span></p>
                </a>
            `;
            productList.appendChild(li);
        });
    } catch (error) {
        console.error("에러 발생:", error);
    }
}
fetchProducts();
