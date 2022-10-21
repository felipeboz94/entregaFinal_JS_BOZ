//----------------------------VARIABLES, CONSTANTES Y DEFINICION DE OBJETOS ---------------------------- 
const PATH_PRODUCTOS = "../json/productos.json"
let botCerrarSesion= document.getElementById('botCerrarSesion')
botCerrarSesion.addEventListener('click',cerrarSesion)
const {nombre, apellido, mail, usuario, pass, estado, intentos} = constructorUsuarioLoginExitoso()
let div = document.getElementById('infUsuario')
div.innerHTML = `<p><strong> Usuario: ${usuario}</strong></p>
`    
let menuCarrito = document.getElementById('menuCarrito')
let bienvenida = document.getElementById('bienvenida')
bienvenida.innerText = ` ¡Bienvenido al e-Commerce, ${nombre}!` 

//----------------------------TIEMPO DE LOGIN----------------------------

setInterval(() => {
  //declaración de botones para eventos
  const DateTime = luxon.DateTime
  const Duration = luxon.Duration
  const ahora = DateTime.now()
  const x = DateTime.fromISO(sessionStorage.getItem('fechaLogin'))
  const fechaLogueo = Duration.fromObject({years : x.year, months : x.month, days: x.day, hours: x.hour,minutes:  x.minute, seconds : x.second })
  let resta = ahora.minus(fechaLogueo)
  let div = document.getElementById('duracionLogin')
  div.innerText=`Tiempo desde login: ${resta.hour}:${resta.minute}:${resta.second}`
  
  }, 1000) 

//----------------------------FUNCIONES QUE SE EJECUTAN AL INICIAR----------------------------

escribeNavCarrito()
leeJsonProductos()

//----------------------------FUNCIONES----------------------------


function constructorUsuarioLoginExitoso(){
  let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))

  return usuarioLogueado
}


//MUESTRA EL USUARIO LOGUEADO
function aLogin(){
  window.location.href='../login.html'
}

//CIERRA SESIÓN

function cerrarSesion(){
  Swal.fire({
      title: 'Aviso',
      text: "Seguro que quiere cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
          localStorage.removeItem('usuarioLogueado')
          localStorage.removeItem('carrito')
          sessionStorage.removeItem('fechaLogin')
          aLogin()
      }
    })

}  

//MENSAJE CON TOASTIFY CON EL PRODUCTO AGREGADO

function msgToastify(id){
  let texto = "Se agregó al carrito "
  fetch(PATH_PRODUCTOS)
  .then((respuesta) => respuesta.json())
  .then((respuesta) => {
    for (let i = 0; i < respuesta.length; i++) {
      if (respuesta[i].id == id) {  
        texto = texto + respuesta[i].tipo + " " +respuesta[i].modelo + " " +respuesta[i].detalle 
      }}
      Toastify({
        text :  texto,
        duration : 3000,
        position: 'right'
      }).showToast()     
    
    })


}

//TRAE EL TOTAL DE PRODUCTOS EN EL CARRITO


function itemsCarrito(){
    let carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'))
    let total = 0
    if (carritoAlmacenado != null){
    for(const productos of carritoAlmacenado){
      total += productos.cantidad
    }
  }
    return total
}

//ESCRIBE EN LA NAV LA CANTIDAD DE PRODUCTOS DEL CARRITO
function escribeNavCarrito(){
  let total = itemsCarrito()
  if(total != 0){
    menuCarrito.innerText = 'Tu compra ('+total + ')'
  }
}

//AGREGA PRODUCTO AL CARRITO: SI EL PRODUCTO NO ESTÁ, PONE CANTIDAD = 1, SINO LE SUMA 1. ESTO ES EN UNA VARIABLE LOCAL


function agregarAlCarrito(id){
  msgToastify(id)
  let carritoAlmacenado = []
  let nuevoProducto = []
  carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'))
  let existe = 0
  if (carritoAlmacenado != null){
    
  for (let i = 0; i < carritoAlmacenado.length; i++) {
    if (carritoAlmacenado[i].idProducto == id) {
      carritoAlmacenado[i].cantidad = carritoAlmacenado[i].cantidad + 1
      localStorage.setItem('carrito',JSON.stringify(carritoAlmacenado))
      existe = 1
      break;
    }
  }
}
  if (existe == 0){
    let producto = {"idProducto" : id , "cantidad" : 1}
    if (carritoAlmacenado != null){  
      carritoAlmacenado.push(producto)
      localStorage.setItem('carrito',JSON.stringify(carritoAlmacenado))
    }
    else{
      nuevoProducto.push(producto)
      localStorage.setItem('carrito',JSON.stringify(nuevoProducto))
    }
  }
  escribeNavCarrito()
  }

 //CREA EL HTML DE LA CARD DE BOOTSTRAP QUE CORRESPONDE A UN PRODUCTO  

function creaCardProducto(producto){
    let htmlCard = `
    <div class="card colorCards" style="width: 20rem;">
      <div id="carouselExampleControls${producto.id}" class="carousel slide card-img-top" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="..${producto.carpetaImagen}1.png" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="..${producto.carpetaImagen}2.png" class="d-block w-100 " alt="...">
          </div>
          <div class="carousel-item">
            <img src="..${producto.carpetaImagen}3.png" class="d-block w-100" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls${producto.id}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls${producto.id}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div class="card-body">
        <p class="card-text"><h2>${producto.tipo} ${producto.marca} ${producto.modelo}</h2></p>        
        <p class="card-text">${producto.detalle}</p>
        <p class="card-text"><h3>$ ${producto.precio}</h3></p>
        <p class="card-text">Stock ${producto.stockDisponible}</p>        
        <button type = "button" onclick = "agregarAlCarrito(${producto.id})">Agregar al carrito</button>
      </div>
    </div>
    `
    return htmlCard
}

 //AGREGA TODAS LAS CARDS DENTRO DEL CONTENEDOR ESPECIFICO

function creaCards(jsonProductos){
    let cardsHTML = ''
    for (const producto of jsonProductos){
        cardsHTML += creaCardProducto(producto)
    }
    //console.log(cardsHTML)
    let contenedorCards = document.getElementById('contenedorCards')
    contenedorCards.innerHTML=cardsHTML
}

 //LEE TODOS LOS PRODUCTOS QUE HAY EN EL JSON

function leeJsonProductos(){
    fetch(PATH_PRODUCTOS)
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
        creaCards(respuesta)
    })
}
