// Data arrays for categories and books
const categories = [
    {
        name: "Children",
        img: "https://media.istockphoto.com/id/470498254/photo/alphabet-block-with-word-dream.jpg?s=1024x1024&w=is&k=20&c=bn7GmkIEGqeifp0sjy_9zOmuSt_wSD0vL2xBCazgP44="
    },
    {
        name: "Education",
        img: "https://media.istockphoto.com/id/182859417/photo/back-to-school.jpg?s=2048x2048&w=is&k=20&c=TYNVhrLOAC5xNra-JWKAVlH1lCo5VbQ94rRLJqj08SA="
    },
    {
        name: "Fantasy",
        img: "https://images.unsplash.com/photo-1711185892711-cdf27b3b8b54?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFudGFzeSUyMGJvb2tzfGVufDB8fDB8fHww"
    },
    {
        name: "Religion",
        img: "https://plus.unsplash.com/premium_photo-1676446443225-0aadc4ae2aa1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVsaWdpb24lMjBjYXRlZ29yaWVzJTIwaW1hZ2UlMjBmb3IlMjB0aGUlMjBib29rJTIwd2Vic2l0ZXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name: "Fiction",
        img: "https://media.istockphoto.com/id/522513933/photo/book-and-glowing-letters.webp?a=1&b=1&s=612x612&w=0&k=20&c=8Nf1QCATrHrxfQFdBE6sCcYHS4mM3m7BZ37IQnCqt48="
    },
    // Additional categories
    {
        name: "Science",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60"
    },
    {
        name: "History",
        img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=60"
    }
];

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
    // Additional books
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

// Function to render categories
function renderCategories() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
            <a href="category.html?category=${encodeURIComponent(category.name)}" target="_blank" style="text-decoration:none; color:inherit;">
                <img src="${category.img}" alt="${category.name}" />
                <p>${category.name}</p>
            </a>
        `;
        categoryList.appendChild(div);
    });
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
        <div class="book-buttons">
            <a href="#" class="add-to-cart">Add to Cart</a>
            <a href="#" class="buy-now">Buy Now</a>
        </div>
        `;
        bookList.appendChild(div);
    });
    attachAddToCartListeners();
    attachBuyNowListeners();
}

// Function to attach buy-now event listeners
function attachBuyNowListeners() {
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', function () {
            const bookItem = this.parentElement;
            const title = bookItem.querySelector('h3').innerText;
            const author = bookItem.querySelector('p:nth-child(2)').innerText;
            const price = bookItem.querySelector('.price').innerText;
            const imgSrc = bookItem.querySelector('img').src;

            const book = { title, author, price, imgSrc };

            // Assuming userId is stored in localStorage or similar
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in to buy books.');
                return;
            }

            fetch('/buy-now', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, book }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Purchase successful');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error processing purchase');
            });
        });
    });
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

function searchBooks() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        renderBooks(books);
        return;
    }
    // Open category.html in new tab with search query parameter
    const url = `category.html?search=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
}

renderCategories();
renderBooks(books);

document.getElementById('search-button').addEventListener('click', searchBooks);

document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchBooks();
    }
});
