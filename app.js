// selector
const filterInput = document.querySelector("#filter");
const nameInput = document.querySelector(".product-name");
const priceInput = document.querySelector(".product-price");
const addBtn = document.querySelector(".add-product");
const deleteBtn = document.querySelector(".delete-product");
const productListUl = document.querySelector(".collection");
const showMsg = document.querySelector(".msg")

// data/state 
let productData = getDataFromLocalStorage();

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
    if(localStorage.getItem("productItems") === null) {
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
       if(result.length === 0) location.reload();

}

// added data showing to ui
function getData(productList) {
    if (productData.length > 0) {
        showMsg.innerHTML = '';
        let li = '';
        productList.forEach(product => {
            const { id, name, price } = product;
            li = document.createElement('li');
            li.className = 'list-group-item collection-item';
            li.id = `product-${id}`;
            li.innerHTML = `<strong>${name}</strong>-
            <span class="product-price">${price}</span>
            <i class="fa fa-trash float-end delete-product"></i>`;

            productListUl.appendChild(li);
        });
    } else {
        // showMsg.innerHTML = 'No item to show';
        // showMessage(true, null)
        showMessage("Please add product")
    }
}
getData(productData);

/// message showing function
function showMessage(message) {
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
        setDataToLocalStorage(data);
        productListUl.innerHTML = '';
        getData(productData);
        nameInput.value = '';
        priceInput.value = '';
    }
}

//// remove item
const deleteProduct = (e) => {
    if (e.target.classList.contains("delete-product")) {
        // e.target.parentElement.remove();
        const target = e.target.parentElement;
        e.target.parentElement.parentElement.removeChild(target)

        // removing from UI
        // getting id 
        const id = parseInt(target.id.split('-')[1])
        deleteItemFromLocalStorage(id);
    }
}

/// searching product
const filteringProduct = (e) => {
    const text = e.target.value.toLowerCase()
    document.querySelectorAll(".collection .collection-item")
        .forEach(item => {
            const productName = item.firstElementChild.textContent.toLocaleLowerCase();
            if (productName.indexOf(text) === -1) {
                // showMessage(null, true)
                showMessage("No item found")
                item.style.display = "none";
                // showMsg.innerHTML = "No item found"
            } else {
                // showMsg.innerHTML = ""
                item.style.display = "block";
                showMsg.innerHTML = ""
            }
        });
}


// function showMessage(fetchMessage, searchMessage) {
//     if(fetchMessage) {
//         showMsg.innerHTML = "Please add product";
//     } else if (searchMessage) {
//         showMsg.innerHTML = "No item found";
//     }
// }

/// events calling
const allEvents = () => {
    addBtn.addEventListener("click", addProduct);
    productListUl.addEventListener("click", deleteProduct);
    filterInput.addEventListener('keyup', filteringProduct);
}
allEvents();