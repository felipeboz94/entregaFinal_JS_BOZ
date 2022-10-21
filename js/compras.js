//----------------------------VARIABLES, CONSTANTES Y DEFINICION DE OBJETOS ----------------------------
const PATH_PRODUCTOS = "../json/productos.json"
let botCerrarSesion= document.getElementById('botCerrarSesion')
botCerrarSesion.addEventListener('click',cerrarSesion)
const {nombre, apellido, mail, usuario, pass, estado, intentos} = constructorUsuarioLoginExitoso()
let div = document.getElementById('infUsuario')
div.innerHTML = `<p><strong> Usuario: ${usuario}</strong></p>
`    

let bienvenida = document.getElementById('bienvenida')
bienvenida.innerText = ` ¡Tu compra (${itemsCarrito()}), ${nombre}!`
let divTabla = document.getElementById('divTablas')

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

escribeTitulo()
leeJsonProductos()

//----------------------------FUNCIONES----------------------------


//MUESTRA EL USUARIO LOGUEADO
function constructorUsuarioLoginExitoso(){
  let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))

  return usuarioLogueado
}

//VA A LA PANTALLA LOGIN

function aLogin(){
  window.location.href='../login.html'
}

//VA A LA PANTALLA HOME

function aHome(){
  window.location.href='home.html'
}

//LA COMPRA EXITOSA MUESTRA UN CARTEL Y VA A HOME

function compraExitosa(){
  Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Compra exitosa',
      showConfirmButton: true,
      timer: 50000
    })
    .then((result) => {
      localStorage.removeItem('carrito')
      aHome()
  } )
} 

//CUANDO SE GENERA LA COMPRA CON EL BOTÓN, QUEDÓ COMENTADO UNA POTENCIAL FUNCIÓN DE GENERACIÓN DE PDF PARA UNA FACTURA
//Y SE VA A compraExitosa()

function generaCompra(){
  //informacion en https://www.desarrollolibre.net/blog/css/generando-reportes-pdfs-con-javascript
  // ver para generar de un div https://stackoverflow.com/questions/18191893/generate-pdf-from-html-in-div-using-javascript
/*   window.jsPDF = window.jspdf.jsPDF;
  let doc = new jsPDF()
  let source = document.getElementsByTagName('table')[0] 
  window.fromHTML(source,15,15,{'width':100})
  window.output("pruebaCarrito") */
  compraExitosa()
}

//CIERRA SESIÓN

function cerrarSesion(){
  Swal.fire({
      title: 'Aviso',
      text: "Seguro que quiere cerrar sesión?", 
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

// FUNCIÓN QUE ESCRIBE EL TITULO DE LA PÁGINA

function escribeTitulo(){
  let total = itemsCarrito()
  if(total != 0){
    menuCarrito.innerText = 'Tu compra ('+total + ')'
  }
}


 //ARMA LA TABLA DE LOS PRODUCTOS SI ES QUE HAY EN EL CARRITO
  
function creaTablaProductos(productos){

    let texto 
    let li
    //Array con la información a agregar
    let carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'))
    let parcial = 0
    let total = 0
    console.log(productos)
    console.log(carritoAlmacenado)
    if (carritoAlmacenado != null){
      let table = document.createElement('table')
      table.className = "tablaProductos"

      //table head
      let thead = document.createElement('thead')
      let tr = document.createElement('tr')
      let col1 = document.createElement('th')
      let col2 = document.createElement('th')
      let col3 = document.createElement('th')
      let col4 = document.createElement('th')
      col1.appendChild(document.createTextNode('ID'))
      col2.appendChild(document.createTextNode('Artículo'))
      col3.appendChild(document.createTextNode('Unidades'))
      col4.appendChild(document.createTextNode('Total'))
      tr.appendChild(col1)
      tr.appendChild(col2)
      tr.appendChild(col3)
      tr.appendChild(col4)
      thead.appendChild(tr)
      table.appendChild(thead)

      //table body
      let tableBody = document.createElement('tbody')
      let i = 0
    for (const producto of productos){
        for (const productoCarrito of carritoAlmacenado){
          tr = document.createElement('tr')
            if (producto.id == productoCarrito.idProducto){
                i++
                let id = document.createElement('td')
                let td1 = document.createElement('td')
                let td2 = document.createElement('td')
                let td3 = document.createElement('td')
                parcial = producto.precio * productoCarrito.cantidad
                total += parcial 
                texto = `${producto.tipo} ${producto.marca} ${producto.modelo} ${producto.detalle}--> $${producto.precio}x${productoCarrito.cantidad} u= $ ${parcial}
                `
                id.appendChild(document.createTextNode(i))
                td1.appendChild(document.createTextNode(`${producto.tipo} ${producto.marca} ${producto.modelo} ${producto.detalle}`))
                td2.appendChild(document.createTextNode(`${productoCarrito.cantidad} u `))  
                td3.appendChild(document.createTextNode(` $ ${parcial}`))    
                tr.appendChild(id) 
                tr.appendChild(td1)
                tr.appendChild(td2)
                tr.appendChild(td3)     
                tableBody.appendChild(tr)
                //li = document.createElement("li")
                //li.innerHTML = texto
                //divTabla.appendChild(li)
            }


        }

      }
      table.appendChild(tableBody)

      //footer
  
      let tfooter = document.createElement('tfoot')
      tr = document.createElement('tr')
      
      let id = document.createElement('td')
      let td1 = document.createElement('td')
      let td2 = document.createElement('td')
      td1.setAttribute('colspan',3)
      td1.appendChild(document.createTextNode('El valor final (con IVA: 21%) es :'))
      td2.appendChild(document.createTextNode('$ ' + total*1,21))
      tr.appendChild(td1)
  
      tr.appendChild(td2)
      tfooter.appendChild(tr)
      table.appendChild(tfooter)
      //li = document.createElement("li")
      //li.innerHTML = `El valor final (con IVA: 21%) es : `+total*1,21
  
      divTabla.appendChild(table)
      //divTabla.appendChild(li)
      let boton = document.createElement('button')
      boton.type='button'
      boton.innerText = 'Realizar compra'
      boton.setAttribute("id","botComprar")
      
      boton.addEventListener('click',generaCompra)
      divTabla.appendChild(boton)
}
else{
        divTabla.innerHTML = '<p>No tiene productos en el carrito </p>'
}

}

// LEE EL ARCHIVO JSON DE LOS PRODUCTOS PARA PODER COMPARAR CON EL CARRITO
function leeJsonProductos(){
    fetch(PATH_PRODUCTOS)
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
        creaTablaProductos(respuesta)
    })
}
