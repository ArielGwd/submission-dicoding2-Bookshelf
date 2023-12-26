const books = [];
const RENDER_BOOKS = "render-books";
const SAVED_BOOKS = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateID() {
  return +new Date();
}

function generateBooksObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findIndexBook(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function addBook() {
  const id = generateID();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("date").value);

  const checkBox = document.getElementById("sudah-dibaca");

  if (checkBox.checked) {
    const bookObject = generateBooksObject(id, title, author, year, true);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveData();
  } else {
    const bookObject = generateBooksObject(id, title, author, year, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveData();
  }
}

function makeBook(bookObject) {
  const judulBuku = document.createElement("h3");
  judulBuku.innerText = bookObject.title;

  const Author = document.createElement("p");
  Author.innerText = bookObject.author;

  const timeYear = document.createElement("p");
  timeYear.innerText = bookObject.year + ", ";

  const infoBook = document.createElement("div");
  infoBook.classList.add("info");
  infoBook.append(timeYear, Author);

  const contentBook = document.createElement("div");
  contentBook.classList.add("content-book");
  contentBook.append(judulBuku, infoBook);

  const newContainer = document.createElement("div");
  newContainer.classList.add("card", "container-list");
  newContainer.append(contentBook);
  newContainer.setAttribute("id", `book-${bookObject.id}`);

  const buttonDelete = document.createElement("div");
  buttonDelete.classList.add("btn-delete", "margin-kiri");
  buttonDelete.addEventListener("click", () => {
    deleteBook(bookObject.id);
  });

  if (bookObject.isComplete) {
    const buttonUndo = document.createElement("div");
    buttonUndo.classList.add("btn-undo");
    buttonUndo.addEventListener("click", () => {
      undoComplated(bookObject.id);
    });

    newContainer.append(buttonUndo, buttonDelete);
  } else {
    const buttonComplated = document.createElement("div");
    buttonComplated.classList.add("btn-complated");
    buttonComplated.addEventListener("click", () => {
      addComplated(bookObject.id);
    });

    newContainer.append(buttonComplated, buttonDelete);
  }

  return newContainer;
}

function addComplated(bookId) {
  const bukuTarget = findBook(bookId);
  if (bukuTarget == null) return;

  bukuTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData();
}

function undoComplated(bookId) {
  const bukuTarget = findBook(bookId);
  if (bukuTarget == null) return;

  bukuTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData();
}

function deleteBook(bookId) {
  const bukuTarget = findIndexBook(bookId);
  if (bukuTarget == -1) return;

  books.splice(bukuTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData();
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOKS));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_BOOKS));
  }
}

document.addEventListener(SAVED_BOOKS, () => {
  setTimeout(() => {
    alert("Sedang menyimpan data...");
  }, 400);

  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_BOOKS, () => {
  const bookBelumSelesai = document.getElementById("belum-selesai");
  bookBelumSelesai.innerHTML = "";

  const bookSudahSelesai = document.getElementById("selesai-baca");
  bookSudahSelesai.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (!book.isComplete) {
      bookBelumSelesai.append(bookElement);
    } else {
      bookSudahSelesai.appendChild(bookElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btnAddNav = document.getElementById("btn-add-nav");
  const cardAdd = document.getElementById("bg-add");
  const btnCancelAdd = document.getElementById("cancel");
  const submitForm = document.getElementById("form");
  const search = document.getElementById("search");

  btnAddNav.addEventListener("click", () => {
    cardAdd.style.display = "block";
  });

  btnCancelAdd.addEventListener("click", () => {
    cardAdd.style.display = "none";
  });

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();

    setTimeout(() => {
      submitForm.reset();
      cardAdd.style.display = "none";
    }, 2500);
  });

  search.addEventListener("input", () => {
    const searchInput = search.value.trim().toLowerCase();
    filterJudulBuku(searchInput);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function filterJudulBuku(searchInput) {
  const allBook = document.querySelectorAll(".container-list");
  allBook.forEach(function (newContainer) {
    const searchJudulBuku = newContainer.querySelector("h3").textContent.toLowerCase();
    const aksiSearch = searchJudulBuku.includes(searchInput);

    if (aksiSearch) {
      newContainer.style.display = "flex";
    } else {
      newContainer.style.display = "none";
    }
  });
}
