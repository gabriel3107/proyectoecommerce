const socket = io();


const agregarForm = document.getElementById('agregarForm');
const productoInput = document.getElementById('producto');

agregarForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoProducto = productoInput.value;

   
    socket.emit('agregarProducto', nuevoProducto);


    productoInput.value = '';
});



const eliminarForm = document.getElementById('eliminarForm');
const productIdInput = document.getElementById('productId');

eliminarForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productId = productIdInput.value;


    socket.emit('eliminarProducto', productId);

    productIdInput.value = '';
});




const cont = document.getElementById('cntDeProductos');

socket.on('mostrartodo', data => {
    cont.innerHTML = '';

    data.forEach(prod => {
        cont.innerHTML += `
            <ul>
            <li>${prod.title}</li>
            <li>${prod.description}</li>
             <li>${prod.price}</li>
            <li>${prod.thumbnail}</li>
            <li>${prod.code}</li>
            <li>${prod.stock}</li>
            <li>${prod.id}</li>
            </ul>
        `;
    });
});