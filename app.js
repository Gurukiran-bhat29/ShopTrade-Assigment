let path = '/data/products.json';

function allProducts(event) {
  if (!event) {
    loadJSON(path);
  } else {
    renderProducts();
    activeButtons(event);
  }
}

function loadJSON(path) {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if(xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				let data = JSON.parse(xhr.responseText);
				localStorage.setItem('allProducts', JSON.stringify(data));
        localStorage.setItem('active', 'cat-all');
        localStorage.setItem('cartItems', 0);
        renderProducts();
			} else {
				window.alert('Something went wrong, fetching!!');
			}
		}
	};
	xhr.open('GET', path, true);
	xhr.send();
}

function activeButtons(event) {
  document.getElementById(localStorage.getItem('active')).classList.remove('active');
  document.getElementById(event.target.id).classList.add('active');
  localStorage.setItem('active', event.target.id);
}

function filteredProduct(event) {
  renderProducts(event.target.id)
  activeButtons(event);
}

function diffSizes(event) {
  const element = document.getElementById(`cart${event.target.id}`);
  element.style.display = "block";
}

function cardButton(event) {
  const cartItems = localStorage.getItem('cartItems');
  const cartCount = Number(cartItems) + 1
  localStorage.setItem('cartItems', cartCount);
  const element = document.getElementById(`cart${event.target.id}`);
  const cardId = document.getElementById('cart-count');
  cardId.innerHTML = cartCount;
  cardId.style.display = 'inline-block';
  element.style.display = "none";
}

function renderProducts(cat = '') {
  const productContainer = document.getElementById('product-container');
  productContainer.innerHTML = "";
  const data = JSON.parse(localStorage.getItem('allProducts'));

  data.forEach((item, index) => {
    if (cat) {
      if (item.tag === cat) {
        productContainer.innerHTML += `
          <div class="product-item">
            <div class="prod-image">
              <img src="${item.image_src}" alt="">
            </div>
            <div class="prod-data">
              <label id="prod-title">${item.vendor}</label></br>
              <label id="prod-name">${item.name}</label></br>
              <div class="product-details">
                <div class="add-to-cart" id='cart${index}'>
                  <button class="card-button" id='${index}' onclick="cardButton(event)">
                    ADD TO CART
                  </button>
                </div>
                <label id="prod-price">Sizes:</label>
                ${item.options.map((size) => {
                  return `
                    <span key='${index}' class='diff-sizes' id='${index}' onclick="diffSizes(event)">
                      ${size.value}
                    </span>
                  `})
                }
              </div>
              <label id="prod-price">$ ${item.price}</label>
              <label><span id="prod-discount-price">$${item.compare_at_price}</span> (50% OFF)</label>
            </div>
          </div>
        `;
      }
    } else {
      productContainer.innerHTML += `
        <div class="product-item">
          <div class="prod-image">
            <img src="${item.image_src}" alt="">
          </div>
          <div class="prod-data">
            <label id="prod-title">${item.vendor}</label></br>
            <label id="prod-name">${item.name}</label></br>
            <div class="product-details">
              <div class="add-to-cart" id='cart${index}'>
                <button class="card-button" id='${index}' onclick="cardButton(event)">
                  ADD TO CART
                </button>
              </div>
              <label id="prod-price">Sizes:</label>
              ${item.options.map((size) => {
                return `
                  <span key='${index}' class='diff-sizes' id='${index}' onclick="diffSizes(event)">
                    ${size.value}
                  </span>
                `})
              }
            </div>
            <label id="prod-price">$ ${item.price}</label>
            <label><span id="prod-discount-price">$${item.compare_at_price}</span> (50% OFF)</label>
          </div>
        </div>
      `;
    }
  });
}

