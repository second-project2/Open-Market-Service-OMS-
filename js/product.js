const API_URL = "https://api.wenivops.co.kr/services/open-market/products/";

async function fetchProducts() {
    const productList = document.getElementById("productList");
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        productList.innerHTML = "";
        data.results.forEach(item => {
            const li = document.createElement("li");
            li.className = "product-card";
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