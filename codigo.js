const cards = document.getElementById("cards");
const templateCards = document.getElementById("template-cards").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment()
const items = document.getElementById("items")


let carrito = {};



const fechApi = async () => {
    try {
        const productos = await fetch("./api.json");
        const data = await productos.json();

        dibujarCards(data);

    } catch (error) {
        console.log("error")
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fechApi();
    if (localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        renderizarCarrito();
    }
    
})


items.addEventListener("click", (e) => {
    renderizarCarrito(e);
    btnAccion(e)
})

const dibujarCards = (data) => {
    data.forEach((objeto) => {
        templateCards.querySelector("h5").textContent = objeto.titulo;
        templateCards.querySelector("p").textContent = objeto.precio;
        templateCards.querySelector(".btn-dark").dataset.id = objeto.id;
        templateCards.querySelector("img").src = objeto.imagen;

        const clone = templateCards.cloneNode(true);
        fragment.appendChild(clone);
    });


    cards.appendChild(fragment)
}

cards.addEventListener("click", (e) => {
    agregarCarrito(e)
})


const agregarCarrito= (e) => {
    if (e.target.classList.contains("btn-dark")){
       setCarrito(e.target.parentElement) 
    }

}






const setCarrito = (objeto) => {
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        titulo: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1,
    };

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = { ...producto }
    renderizarCarrito(carrito)
    
}

const renderizarCarrito = () => {
    Object.values(carrito).forEach((producto) => {
        items.innerHTML = "";
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelector(".btn-success").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.titulo;
        templateCarrito.querySelectorAll("td")[2].textContent = producto.precio;
        templateCarrito.querySelectorAll("td")[3].textContent = producto.cantidad;
        templateCarrito.querySelectorAll("td")[4].textContent = producto.cantidad * producto.precio;
        
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    localStorage.setItem("carrito", JSON.stringify(carrito))
} 

const btnAccion = (e) => {
    if (e.target.classList.contains("btn-success")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[producto.id] = {...producto}
    } 
    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[producto.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
    }
    renderizarCarrito()
}


localStorage("carrito", carrito)



