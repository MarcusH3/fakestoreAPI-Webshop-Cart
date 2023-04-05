const productContainer = document.getElementById('product-container');
const loadButton = document.getElementById('load-products');
const cartIcon = document.getElementById('cart-icon');
const cartContainer = document.getElementById('cart-container');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutButton = document.getElementById('checkout-button');
const cartTotal = document.getElementById('cart-total');
const cartItems = [];

loadButton.addEventListener('click', async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  const products = await response.json();

  productContainer.innerHTML = '';

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    const titleElement = document.createElement('h2');
    titleElement.textContent = product.title;

    const imageElement = document.createElement('img');
    imageElement.src = product.image;

    const priceElement = document.createElement('p');
    priceElement.textContent = `$${product.price}`;

    const buyButton = document.createElement('button');
    buyButton.textContent = 'Buy';
    buyButton.addEventListener('click', () => {
      cartItems.push(product);
      updateCart();
      alert(`${product.title} added to cart!`);
    });

    productElement.appendChild(titleElement);
    productElement.appendChild(imageElement);
    productElement.appendChild(priceElement);
    productElement.appendChild(buyButton);

    productContainer.appendChild(productElement);
  });
});

cartIcon.addEventListener('click', () => {
  toggleCart();
});

checkoutButton.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
    } else {
      const cartData = {
        items: cartItems,
        total: getCartTotal()
      };
      localStorage.setItem('cart', JSON.stringify(cartData));
      alert(`Checkout complete! Total: $${cartData.total}`);
  
      const summaryContainer = document.createElement('div');
      summaryContainer.classList.add('summary');
  
      const summaryTitle = document.createElement('h2');
      summaryTitle.textContent = 'Order Summary';
  
      const itemsTitle = document.createElement('h3');
      itemsTitle.textContent = 'Items:';
  
      const itemsList = document.createElement('ul');
      cartData.items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.title} x ${item.quantity}`;
        itemsList.appendChild(listItem);
      });
  
      const totalTitle = document.createElement('h3');
      totalTitle.textContent = `Total: $${cartData.total}`;
  
      summaryContainer.appendChild(summaryTitle);
      summaryContainer.appendChild(itemsTitle);
      summaryContainer.appendChild(itemsList);
      summaryContainer.appendChild(totalTitle);
  
      productContainer.innerHTML = '';
      productContainer.appendChild(summaryContainer);
    }
  });

  
  

  function updateCart() {
    const groupedCartItems = cartItems.reduce((groups, product) => {
      const id = product.id;
      if (!groups[id]) {
        groups[id] = {
          ...product,
          quantity: 1
        };
      } else {
        groups[id].quantity++;
      }
      return groups;
    }, {});
  
    cartItemsContainer.innerHTML = '';
    
    
  
    Object.values(groupedCartItems).forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');
  
      const titleElement = document.createElement('h2');
      titleElement.textContent = product.title;
  
      const imageElement = document.createElement('img');
      imageElement.src = product.image;
  
      const priceElement = document.createElement('p');
      priceElement.textContent = `$${product.price} x ${product.quantity}`;
  
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        const index = cartItems.findIndex(item => item.id === product.id);
        if (index > -1) {
          cartItems.splice(index, 1);
        }
        updateCart();
      });
  
      productElement.appendChild(titleElement);
      productElement.appendChild(imageElement);
      productElement.appendChild(priceElement);
      productElement.appendChild(removeButton);
  
      cartItemsContainer.appendChild(productElement);
      
    });
  
    cartTotal.textContent = `$${getCartTotal()}`;
  
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.length;
  }

function toggleCart() {
  cartContainer.classList.toggle('hidden');
}
function clearCart() {
  cartItems.length = 0;

  updateCart();
}

function getCartTotal() {
    const total = cartItems.reduce((total, product) => {
      return total + product.price;
    }, 0);
    return total.toFixed(2);
  }
;
