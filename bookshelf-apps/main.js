document.addEventListener("DOMContentLoaded", function () {
    const inputBookForm = document.getElementById("inputBook");
    const searchBookForm = document.getElementById("searchBook");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    function generateID() {
        return +new Date();
    }

    function createBookItem(title, author, year, isComplete) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.innerHTML = `
            <h3>${title}</h3>
            <p>Penulis: ${author}</p>
            <p>Tahun: ${year}</p>
            <div class="action">
                ${isComplete ? `
                    <button class="green" onclick="moveBook(this.parentElement.parentElement, false)">Belum selesai dibaca</button>
                ` : `
                    <button class="green" onclick="moveBook(this.parentElement.parentElement, true)">Selesai dibaca</button>
                `}
                <button class="red" onclick="deleteBook(this.parentElement.parentElement)">Hapus buku</button>
            </div>`;
        return bookItem;
    }

    function addBookToShelf(title, author, year, isComplete) {
        const bookItem = createBookItem(title, author, year, isComplete);
        if (isComplete) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }
    }

    inputBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const titleInput = document.getElementById("inputBookTitle");
        const authorInput = document.getElementById("inputBookAuthor");
        const yearInput = document.getElementById("inputBookYear");
        const isCompleteInput = document.getElementById("inputBookIsComplete");
        const title = titleInput.value;
        const author = authorInput.value;
        const year = parseInt(yearInput.value);
        const isComplete = isCompleteInput.checked;
        const id = generateID();
        addBookToShelf(title, author, year, isComplete);
        const book = {
            id: id,
            title: title,
            author: author,
            year: year,
            isComplete: isComplete
        };
        saveBookToStorage(book);
        inputBookForm.reset();
    }
    );

    window.moveBook = function (bookItem, isComplete) {
        const parentShelf = bookItem.parentElement;
        const title = bookItem.querySelector("h3").textContent;
        const author = bookItem.querySelector("p:nth-of-type(1)").textContent.split(": ")[1];
        const year = parseInt(bookItem.querySelector("p:nth-of-type(2)").textContent.split(": ")[1]);
        parentShelf.removeChild(bookItem);
        addBookToShelf(title, author, year, isComplete);
        const book = {
            id: generateID(),
            title: title,
            author: author,
            year: year,
            isComplete: isComplete
        };
        saveBookToStorage(book);
    };

    window.deleteBook = function (bookItem) {
        const parentShelf = bookItem.parentElement;
        const title = bookItem.querySelector("h3").textContent;
        const books = JSON.parse(localStorage.getItem("books"));
        const updatedBooks = books.filter(book => book.title !== title);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
        parentShelf.removeChild(bookItem);
    };

    function saveBookToStorage(book) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    function loadBooksFromStorage() {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        books.forEach(book => {
            addBookToShelf(book.title, book.author, book.year, book.isComplete);
        }
        );
    }

    loadBooksFromStorage();
}
);
