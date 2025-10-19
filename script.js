// Base de datos de libros 📚
const books = [
    { id: 1, titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", genero: "Realismo mágico", imagen: "https://covers.openlibrary.org/b/id/8377261-L.jpg" },
    { id: 2, titulo: "El Principito", autor: "Antoine de Saint-Exupéry", genero: "Fábula", imagen: "https://covers.openlibrary.org/b/id/8228691-L.jpg" },
    { id: 3, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", genero: "Clásico", imagen: "https://covers.openlibrary.org/b/id/8318303-L.jpg" },
    { id: 4, titulo: "1984", autor: "George Orwell", genero: "Distopía", imagen: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
    { id: 5, titulo: "La Odisea", autor: "Homero", genero: "Épica", imagen: "https://covers.openlibrary.org/b/id/10909303-L.jpg" },
    { id: 6, titulo: "Orgullo y Prejuicio", autor: "Jane Austen", genero: "Romance", imagen: "https://covers.openlibrary.org/b/id/8091016-L.jpg" },
    { id: 7, titulo: "Matar a un Ruiseñor", autor: "Harper Lee", genero: "Drama", imagen: "https://covers.openlibrary.org/b/id/8228695-L.jpg" },
    { id: 8, titulo: "Crimen y Castigo", autor: "Fiódor Dostoyevski", genero: "Psicológico", imagen: "https://covers.openlibrary.org/b/id/10908985-L.jpg" },
    { id: 9, titulo: "Fahrenheit 451", autor: "Ray Bradbury", genero: "Ciencia Ficción", imagen: "https://covers.openlibrary.org/b/id/8228693-L.jpg" },
    { id: 10, titulo: "El Alquimista", autor: "Paulo Coelho", genero: "Filosofía", imagen: "https://covers.openlibrary.org/b/id/8377270-L.jpg" },
    { id: 11, titulo: "El Hobbit", autor: "J.R.R. Tolkien", genero: "Fantasía", imagen: "https://covers.openlibrary.org/b/id/8377265-L.jpg" },
    { id: 12, titulo: "It", autor: "Stephen King", genero: "Terror", imagen: "https://covers.openlibrary.org/b/id/8231855-L.jpg" },
];

// Variables globales
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
let librosPorPagina = 6;
let paginaActual = 1;

// Mostrar sección activa
function showSection(id) {
    document.querySelectorAll('.content').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');

    if (id === 'favoritos') mostrarFavoritos();
    if (id === 'biblioteca') mostrarBiblioteca();
    if (id === 'nuevos') mostrarNuevos();
    if (id === 'categorias') mostrarCategorias();
    if (id === 'autores') mostrarAutores();
    if (id === 'inicio') mostrarDestacados();
}

// Mostrar libros destacados en inicio
function mostrarDestacados() {
    const destacados = books.slice(0, 4);
    const grid = document.getElementById('destacados');
    grid.innerHTML = generarLibrosHTML(destacados);
}

// Generar HTML de libros
function generarLibrosHTML(lista) {
    return lista.map(book => `
        <div class="book-card">
            <img src="${book.imagen}" alt="${book.titulo}">
            <div class="book-info">
                <h3>${book.titulo}</h3>
                <p>${book.autor}</p>
                <p style="font-size:0.9em; color:#777;">${book.genero}</p>
            </div>
            <div class="book-actions">
                <button class="read-btn" onclick="abrirModal(${book.id})">📖 Leer</button>
                <button class="fav-btn" onclick="toggleFavorito(${book.id})">
                    ${favoritos.includes(book.id) ? '💛 Quitar' : '⭐ Favorito'}
                </button>
            </div>
        </div>
    `).join('');
}

// Mostrar biblioteca completa con paginación
function mostrarBiblioteca() {
    const inicio = (paginaActual - 1) * librosPorPagina;
    const fin = inicio + librosPorPagina;
    const paginaLibros = books.slice(inicio, fin);
    const grid = document.getElementById('bibliotecaGrid');
    grid.innerHTML = generarLibrosHTML(paginaLibros);
    generarPaginacion();
}

// Paginación
function generarPaginacion() {
    const totalPaginas = Math.ceil(books.length / librosPorPagina);
    const pagDiv = document.getElementById('pagination');
    pagDiv.innerHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.onclick = () => {
            paginaActual = i;
            mostrarBiblioteca();
        };
        if (i === paginaActual) btn.style.background = '#1a365d';
        pagDiv.appendChild(btn);
    }
}

// Mostrar nuevos libros
function mostrarNuevos() {
    const nuevos = books.slice(-4);
    const grid = document.getElementById('nuevosGrid');
    grid.innerHTML = generarLibrosHTML(nuevos);
}

// Mostrar categorías únicas
function mostrarCategorias() {
    const categorias = [...new Set(books.map(b => b.genero))];
    const cont = document.getElementById('categoryList');
    cont.innerHTML = categorias.map(cat => `
        <div class="category-item" onclick="filtrarPorCategoria('${cat}')">${cat}</div>
    `).join('');
}

function filtrarPorCategoria(cat) {
    const filtrados = books.filter(b => b.genero === cat);
    document.getElementById('bibliotecaGrid').innerHTML = generarLibrosHTML(filtrados);
    showSection('biblioteca');
}

// Mostrar autores
function mostrarAutores() {
    const autores = [...new Set(books.map(b => b.autor))];
    const cont = document.getElementById('authorList');
    cont.innerHTML = autores.map(autor => `
        <div class="author-item" onclick="filtrarPorAutor('${autor}')">${autor}</div>
    `).join('');
}

function filtrarPorAutor(autor) {
    const filtrados = books.filter(b => b.autor === autor);
    document.getElementById('bibliotecaGrid').innerHTML = generarLibrosHTML(filtrados);
    showSection('biblioteca');
}

// Buscar libros 🔍
function searchBooks() {
    const texto = document.getElementById('searchInput').value.toLowerCase();
    const resultados = books.filter(b =>
        b.titulo.toLowerCase().includes(texto) ||
        b.autor.toLowerCase().includes(texto) ||
        b.genero.toLowerCase().includes(texto)
    );
    const grid = document.getElementById('searchResults');
    grid.innerHTML = resultados.length > 0 ?
        generarLibrosHTML(resultados) :
        '<p>No se encontraron resultados.</p>';
}

// Favoritos ⭐
function toggleFavorito(id) {
    const index = favoritos.indexOf(id);
    if (index === -1) favoritos.push(id);
    else favoritos.splice(index, 1);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    mostrarFavoritos();
    mostrarBiblioteca();
    mostrarDestacados();
    mostrarNuevos();
}

// Mostrar favoritos
function mostrarFavoritos() {
    const grid = document.getElementById('favoritosGrid');
    const empty = document.getElementById('emptyFavorites');
    if (favoritos.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
    } else {
        const librosFav = books.filter(b => favoritos.includes(b.id));
        grid.innerHTML = generarLibrosHTML(librosFav);
        empty.style.display = 'none';
    }
}

// Modal 📖
function abrirModal(id) {
    const libro = books.find(b => b.id === id);
    const modal = document.getElementById('bookModal');
    const cont = document.getElementById('modalContent');
    cont.innerHTML = `
        <h2>${libro.titulo}</h2>
        <p><strong>Autor:</strong> ${libro.autor}</p>
        <p><strong>Género:</strong> ${libro.genero}</p>
        <img src="${libro.imagen}" style="width:100%; border-radius:10px; margin-top:15px;">
        <p style="margin-top:15px;">Aquí podrías agregar el texto del libro o un enlace a la lectura en línea.</p>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(e) {
    const modal = document.getElementById('bookModal');
    if (e.target === modal) {
        closeModal();
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    showSection('menu');
});
