// selector
const filterInput = document.querySelector("#filter");
const nameInput = document.querySelector(".product-name");
const priceInput = document.querySelector(".product-price");
const addBtn = document.querySelector(".add-product");
const deleteBtn = document.querySelector(".delete-product");
const productListUl = document.querySelector(".collection");
const showMsg = document.querySelector(".msg")
const formElm = document.querySelector("form")

// data/state 
let productData = getDataFromLocalStorage();
console.log(productData);

function getDataFromLocalStorage() {
    let items = '';
    if (localStorage.getItem("productItems") === null) {
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem("productItems"));
    }
    return items;
}

function setDataToLocalStorage(item) {
    let items = '';
    if (localStorage.getItem("productItems") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("productItems", JSON.stringify(items));
    } else {
        items = JSON.parse(localStorage.getItem("productItems"));
        items.push(item);
        localStorage.setItem("productItems", JSON.stringify(items));
    }
}

function deleteItemFromLocalStorage(id) {
    const items = JSON.parse(localStorage.getItem("productItems"));
    let result = items.filter(product => {
        return product.id !== id;
    })
    localStorage.setItem("productItems", JSON.stringify(result));
    if (result.length === 0) location.reload();

}

// added data showing to ui
function getData(productList) {
    productListUl.innerHTML = ''
    if (productData.length > 0) {
        showMessage()
        productList.forEach(product => {
            console.log(product.id);
            const { id, name, price } = product;
            let li = document.createElement('li');
            li.className = 'list-group-item collection-item';
            li.id = `product-${id}`;
            li.innerHTML = `<strong>${name}</strong>-
            <span class="product-price">$${price}</span>
            <i class="fas fa-pencil-alt float-end edit-product"></i>
            <i class="fas fa-trash ms-2 float-end delete-product"></i>
            `

            productListUl.appendChild(li);
        });
    } else {
        // showMsg.innerHTML = 'No item to show';
        // showMessage(true, null)
        showMessage("Please add product")
    }
}

/// message showing function
function showMessage(message = '') {
    showMsg.innerHTML = message;
}

/// adding item 
const addProduct = e => {
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
        const data = {
            id: id,
            name: name,
            price: price
        }
        productData.push(data);
        // set data to localStorage
        setDataToLocalStorage(data)
        
        getData(productData);
        // productListUl.innerHTML = '';
        nameInput.value = '';
        priceInput.value = '';
    }
}
function resetInput() {
    nameInput.value = '';
    priceInput.value = '';
}
function resetUI() {
    addBtn.style.display = 'block';
    document.querySelector('.update-product').remove()
    document.querySelector('#id').remove()
}

function addOrUpdateProduct(e) {
    if (e.target.classList.contains('add-product')) {
        addProduct(e)
    } else if (e.target.classList.contains('update-product')) {
        updateProduct(e)
        // reset the input
        resetInput();
        // remove update btn
        resetUI()
        // remove the hidden id
        // displaying submit btn
    }
}

function updateProduct(e) {
    e.preventDefault()
    const name = nameInput.value;
    const price = priceInput.value;
    // find the id
    const id = parseInt(e.target.previousElementSibling.value, 10)
    // update the data source
    const productWithUpdates = productData.map(product => {
        if (product.id === id) {
            return {
                ...product,
                name,
                price
            }
        } else {
            return product;
        }
    })
    /// data level update
    productData = productWithUpdates;
    console.log(productData);
    /// UI update
    getData(productData)
}

function findProduct(id) {
    return productData.find(product => product.id === id);
};

function populateEditForm(product) {
    nameInput.value = product.name;
    priceInput.value = product.price;

    // id element
    const idElm = `<input type="hidden" id="id" value=${product.id} />`
    /// update submit button
    const updateButtonElm = `<button class="btn btn-info btn-block text-center update-product">Update</button>`;

    if(document.querySelector('#id')) {
        document.querySelector('#id').setAttribute('value', product.id);
    }

    if(!document.querySelector('.update-product')) {
        document.forms[0].insertAdjacentHTML('beforeend', idElm);
        document.forms[0].insertAdjacentHTML('beforeend', updateButtonElm);

    }
    /// hide submit button
    addBtn.style.display = 'none';
}
//// remove item
const updateOrDeleteProduct = (e) => {
    if (e.target.classList.contains("delete-product")) {
        // e.target.parentElement.remove();
        const target = e.target.parentElement;
        e.target.parentElement.parentElement.removeChild(target)

        // removing from UI
        // getting id 
        const id = parseInt(target.id.split('-')[1])

        let result = productData.filter(productItem => {
            return productItem.id !== id;
        });
        productData = result;
        deleteItemFromLocalStorage(id);
    } else if (e.target.classList.contains("edit-product")) {
        //finding the id
        const target = e.target.parentElement;
        // getting id
        const id = parseInt(target.id.split("-")[1]);
        // find the product
        const foundProduct = findProduct(id);
        /// populate UI
        populateEditForm(foundProduct);
        console.log(foundProduct);
    }
}
/// searching product
const filteringProduct = (e) => {
    let itemLength = 0;
    const text = e.target.value.toLowerCase()
    document.querySelectorAll(".collection .collection-item")
        .forEach(item => {
            const productName = item.firstElementChild.textContent.toLowerCase();
            if (productName.indexOf(text) === -1) {
                // showMessage(null, true)
                // showMessage("No item found")
                item.style.display = "none";
                // showMsg.innerHTML = "No item found"
            } else {
                // showMsg.innerHTML = ""
                item.style.display = "block";
                ++itemLength;
            }
        });
    (itemLength > 0) ? showMessage() : showMessage('No item found');
}


// function showMessage(fetchMessage, searchMessage) {
//     if(fetchMessage) {
//         showMsg.innerHTML = "Please add product";
//     } else if (searchMessage) {
//         showMsg.innerHTML = "No item found";
//     }
// }

// events calling
const loadEventListeners = () => {
    productListUl.addEventListener("click", updateOrDeleteProduct);
    window.addEventListener('DOMContentLoaded', getData.bind(null, productData));
    // addBtn.addEventListener("click", addProduct);
    formElm.addEventListener('click', addOrUpdateProduct);

    filterInput.addEventListener('keyup', filteringProduct);
}
loadEventListeners();