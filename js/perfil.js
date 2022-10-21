//----------------------------VARIABLES, CONSTANTES Y DEFINICION DE OBJETOS ---------------------------- 
let botCerrarSesion= document.getElementById('botCerrarSesion')
botCerrarSesion.addEventListener('click',cerrarSesion)
const {nombre, apellido, mail, usuario, pass, estado, intentos} = constructorUsuarioLoginExitoso()
let div = document.getElementById('infUsuario')
div.innerHTML = `<p><strong> Usuario: ${usuario}</strong></p>
`    
let bienvenida = document.getElementById('bienvenida')
bienvenida.innerText = ` ¡Tu perfil, ${nombre}!`

//----------------------------FUNCIONES QUE SE EJECUTAN AL INICIAR----------------------------

escribeTitulo()
armaPerfil()

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

 //ARMA LOS OBJETOS DE LISTADO CON LOS DATOS DEL USUARIO LOGUEADO   
function armaPerfil(){
    let divPerfil = document.getElementById('divPerfil')
    let ul = document.createElement('ul')
    let usuario = constructorUsuarioLoginExitoso()
    let keys = Object.keys(usuario)
    for (const key of keys){
        if(key != 'pass' && key != 'estado' && key != 'intentos'){
        let li = document.createElement('li')
        li.appendChild(document.createTextNode(`${key} : ${usuario[key]}`))
        ul.appendChild(li)
    }}
    divPerfil.appendChild(ul)

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

//A LOGIN 

function aLogin(){
    window.location.href='../login.html'
  }

//TRAE EL USUARIO LOGUEADO

function constructorUsuarioLoginExitoso(){
  let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))

  return usuarioLogueado
}

//TOTALIDAD DE ITEMS DEL CARRITO 

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

// ESCRIBE EL MENU
function escribeTitulo(){
    let total = itemsCarrito()
    if(total != 0){
      menuCarrito.innerText = 'Tu compra ('+total + ')'
    }
  }