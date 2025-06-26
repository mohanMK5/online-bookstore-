// Data array for books (same as in index.js, can be refactored later to share)
const books = [
    {
        title: "Moon Dance",
        author: "J.R. Rain",
        reviews: 120,
        price: 14,
        img: "https://covers.openlibrary.org/b/id/8231656-L.jpg",
        category: "Fantasy"
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        reviews: 345,
        price: 10,
        img: "https://covers.openlibrary.org/b/id/8773944-L.jpg",
        category: "Fiction"
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        reviews: 220,
        price: 12,
        img: "https://covers.openlibrary.org/b/id/8238763-L.jpg",
        category: "Fiction"
    },
    {
        title: "1984",
        author: "George Orwell",
        reviews: 180,
        price: 15,
        img: "https://covers.openlibrary.org/b/id/7875270-L.jpg",
        category: "Fiction"
    },
    {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        reviews: 200,
        price: 18,
        img: "https://covers.openlibrary.org/b/id/240726-L.jpg",
        category: "Science"
    },
    {
        title: "The Origin of Species",
        author: "Charles Darwin",
        reviews: 150,
        price: 20,
        img: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
        category: "Science"
    },
    {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        reviews: 300,
        price: 22,
        img: "https://covers.openlibrary.org/b/id/8379256-L.jpg",
        category: "History"
    }
];

// Function to get query parameter by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to render books
function renderBooks(bookArray) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    bookArray.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        div.innerHTML = `
            <div class="book-cover">
                <img src="${book.img}" alt="${book.title} Book Cover" />
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p class="reviews">★★★★★ (${book.reviews} Reviews)</p>
                <p class="price">$${book.price}</p>
            </div>
            <a href="#" class="add-to-cart">Add to Cart</a>
        `;
        bookList.appendChild(div);
    });
    attachAddToCartListeners();
}

// Function to attach add-to-cart event listeners
function attachAddToCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const bookItem = this.parentElement;
            const title = bookItem.querySelector('h3').innerText;
            const author = bookItem.querySelector('p:nth-child(2)').innerText;
            const price = bookItem.querySelector('.price').innerText;
            const imgSrc = bookItem.querySelector('img').src;

            const cartItem = { title, author, price, imgSrc };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`${title} has been added to the cart!`);
        });
    });
}

const category = getQueryParam('category');
const search = getQueryParam('search');
const categoryTitle = document.getElementById('category-title');

if (search) {
    categoryTitle.innerText = `Search results for "${search}"`;
    const filteredBooks = books.filter(book => {
        const query = search.toLowerCase();
        return (
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.category.toLowerCase().includes(query)
        );
    });
    renderBooks(filteredBooks);
} else if (category) {
    categoryTitle.innerText = `${category} Books`;
    const filteredBooks = books.filter(book => book.category.toLowerCase() === category.toLowerCase());
    renderBooks(filteredBooks);
} else {
    categoryTitle.innerText = 'All Books';
    renderBooks(books);
}
