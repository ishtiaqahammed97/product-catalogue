// selector
const filterInput = document.querySelector("#filter");
const nameInput = document.querySelector(".product-name");
const priceInput = document.querySelector(".product-price");
const addBtn = document.querySelector(".add-product");
const deleteBtn = document.querySelector(".delete-product");
const productListUl = document.querySelector(".collection");
const ShowMsg = document.querySelector(".msg")


// data/state 
const productData = [];

function getData(productList) {
    if (productData.length > 0) {
        ShowMsg.innerHTML = '';
        let li = '';
        productList.forEach(product => {
            li = document.createElement('li');
            li.className = 'list-group-item collection-item';
            li.id = `product-${product.id}`;
            li.innerHTML = `<strong>${product.name}</strong>-
            <span class="product-price">${product.price}</span>
            <i class="fa fa-trash float-end delete-product"></i>`;

            productListUl.appendChild(li);
        });
    } else {
        ShowMsg.innerHTML = 'No item to show';
    }
}
getData(productData);

/// adding data 
addBtn.addEventListener("click", e => {
    e.preventDefault();
    const name = nameInput.value;
    const price = priceInput.value;

    //setting id
    let id;
    if (productData.length === 0) {
        id = 0;
    } else {
        id = productData[productData.length - 1].id + 1;
    }

    /// validation 
    if (
        name === '' || price === '' ||
        !(!isNaN(parseFloat(price)) && isFinite(price))
    ) {
        alert('Please fill up necessary and valid information')
    } else {
        productData.push({
            id: id,
            name: name,
            price: price
        });
        productListUl.innerHTML = '';
        getData(productData);
        nameInput.value = '';
        priceInput.value = '';
    }
})


//// remove item