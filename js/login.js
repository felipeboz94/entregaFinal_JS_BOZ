//----------------------------VARIABLES, CONSTANTES Y DEFINICION DE OBJETOS ---------------------------- 
const PATH_USUARIOS_REGISTRADOS = "json/usuariosRegistrados.json"
let usuarioIngresado = ''
let botEntrar = document.getElementById('botEntrar')
botEntrar.addEventListener('click',tieneUsuario)
let botCancelar = document.getElementById('botCancelar')
botCancelar.addEventListener('click',limpiaCajas)

//----------------------------FUNCIONES QUE SE EJECUTAN AL INICIAR----------------------------

inicializa()

//CUANDO ARRANCA, SI HAY USUARIO LOGUEADO, VA DERECHO A login2() Y SINO A cargaUsuariosRegistrados
function inicializa(){
    let userRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    if (userRegistrados == null){
        cargaUsuariosRegistrados()
    }
    else{
        login2()
    }

    
}
// CARGA TODOS LOS UAURIOS REGISTRADOS EN EL JSON

function cargaUsuariosRegistrados() {
    fetch(PATH_USUARIOS_REGISTRADOS)
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
        localStorage.setItem('usuariosRegistrados', JSON.stringify(respuesta))
        login2()
    })
}

// SI EL USUARIO ESTÁ LOGUEADO VA AL HOME
function login2(){
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))
    console.log(usuarioLogueado)
    if (usuarioLogueado && usuarioLogueado.estado == 0) 
    {
        sessionStorage.setItem('fechaLogin',luxon.DateTime.now())
        aHome()
    }
    else{
        localStorage.removeItem('carrito')
    }
}

//A HOME
function aHome(){
    window.location.href='pages/home.html'
}

//LIMPIA CAJAS DEL HTML

function limpiaCajas(){
    let inputs = document.getElementsByClassName('input')
    if(inputs.length != 0){
        for (const input of inputs){
            input.value = ""
        }
    }    
}

//DESTRUYE CAJAS DEL HTML

function destructorDivs(){
    let divs = document.getElementsByClassName('div')
    if(divs.length != 0){
        for (const div of divs){
            div.remove()
        }
    }
}

//MODIFICA EL MENSAJE DEL LOGIN
function modificadorMsj(mensaje){
    let div = document.getElementsByClassName('msj')
    console.log(div[0])
    div[0].innerText = mensaje
}

function constructorUsuarioLoginExitoso(usuario){
    let div = document.createElement('div')
    div.className = 'div'
    div.innerHTML = `
                    <p><strong> Nombre: ${usuario.nombre}</strong></p>
                    <p><strong> Apellido: ${usuario.apellido}</strong></p> 
                    <p><strong> Mail: ${usuario.mail}</strong></p> 
                    <p><strong> Usuario: ${usuario.usuario}</strong></p>  
    `
    document.body.append(div)
    
}

//DETERMINA EL ÍNDICE EN EL QUE ESTÁ EL VALOR DE LA CLAVE DENTRO DEL OBJETO

function determinaIndice(clave, valor, objeto){
    let indice = -1
    let aux = 0
    for(const row of objeto){
        aux ++
        if(valor == row[clave]){
            indice = aux
            break
        }  
    }
    return indice
}

//BUSCADOR DE OBJETO USUARIO SSEGÚN EL USUARIO INGRESADO
function buscaUsuario(usuarioIngresado){
    let user
    let auxiliarArrayUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    let mensaje
    auxiliarArrayUsuarios.forEach((usuarioRegistrado) => {
        if (usuarioIngresado == usuarioRegistrado.usuario){
            user = usuarioRegistrado
        }
      
        })      
    user = user || "Nullish"
    user != "Nullish" ? mensaje = "Se encontró al usuario "+ user.usuario : mensaje = "No se encontró al usuario "+ usuarioIngresado
    console.log(mensaje)
    return user
}

//FUNCIÓN DE LOGIN QUE CHEQUEA TANTO EL USUARIO COMO LA CONTRASEÑA Y DEVUELVE ALGÚN CÓDIGO CORRESPONDIENTE

function login(){
    
    let inputUser = document.getElementById('inputUser')
    let inputPass = document.getElementById('inputPass')
    let passIngresada = ''
    let coincideUsuario = false
    let coincideContraseña = false
    let indiceUsuario = -1
    let indiceContrasenia = -1
    let auxiliarArrayUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    usuarioIngresado = inputUser.value
    passIngresada = inputPass.value
    let user = buscaUsuario(usuarioIngresado)
    if(usuarioIngresado == null || usuarioIngresado == ""){
        return 0
    }
    else if(user.estado == 1){
        return 100
    }
    else{
        if (user.usuario != usuarioIngresado){
                console.log('Usuario no coincide '+ user.usuario)                    
            }
            else{
                coincideUsuario = true
                console.log('Usuario coincide '+ user.usuario)
                indiceUsuario = determinaIndice('usuario',user.usuario,auxiliarArrayUsuarios)
                
            }
        }
    
    if(passIngresada == null || passIngresada == ""){
        return 0
    }
    else if (passIngresada != user.pass){
        console.log('La contraseña no coincide '+ user.pass)                    
    }
    else{
        coincideContraseña = true
        console.log('La contraseña coincide '+ user.pass)
    }
                        
    if(coincideUsuario == false){
        return 1    //el usuario ingresado no está en el array
    }

    if((coincideContraseña == false)){
        return 99   //contraseña incorrecta
    } 
    else{
        return 2    // ingreso exitoso
    }
    return -1
}

// ACTUALIZA EL USUARIO TANTO EN INTENTOS, COMO EN ESTADO

function actualizaUsuarios(user){
    
    let auxiliarArrayUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    auxiliarArrayUsuarios.forEach((usuarioRegistrado) => {
    if (user.usuario == usuarioRegistrado.usuario){
        usuarioRegistrado.nombre = user.nombre
        usuarioRegistrado.apellido = user.apellido
        usuarioRegistrado.mail = user.mail
        usuarioRegistrado.usuario = user.usuario
        usuarioRegistrado.pass = user.pass
        usuarioRegistrado.estado = user.estado
        usuarioRegistrado.intentos = user.intentos
    }
    
    }) 
    localStorage.setItem('usuariosRegistrados',JSON.stringify(auxiliarArrayUsuarios))  
        

}

// ELIMINA LOS INTENTOS CUANDO SE BLOQUEA O SE INGRESA

function eliminaIntentos(user){
    user.intentos = 0
    return user
}


//FUNCION QUE LLAMA EL BOTÓN DE LOGIN Y EN BASE AL RESULTADO DE login DETERMINA EL MENSAJE DEL HTML
function tieneUsuario(){
    
        let retLogin = login()
        let mensaje = ''
        let user = buscaUsuario(usuarioIngresado)
        switch(retLogin){
            case -1:
                mensaje = 'No se hizo nada. ERROR' 
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
            case 0:
                mensaje = 'ESC producido' 
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
            case 1:
                mensaje = 'No se encuentra el usuario!'
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
            case 2:
                mensaje = 'Login exitoso!'
                sessionStorage.setItem('fechaLogin',luxon.DateTime.now())
                user.intentos = 0
                actualizaUsuarios(user)
                localStorage.setItem('usuarioLogueado',JSON.stringify(user))
                destructorDivs()
                console.log(mensaje)
                aHome()
                break 

            case 99:
                user.intentos++
                let cantidadIntentosRestantes = 3-user.intentos
                if (user.intentos>=3){
                    user.intentos = 0
                    user.estado = 1
                    mensaje = 'Usuario bloqueado. Llegó a los 3 intentos. Comuníquese con su administrador'
                }
                else{
                    mensaje = `Contraseña incorrecta. Le quedan ${cantidadIntentosRestantes} intentos`
                }
                actualizaUsuarios(user)

                modificadorMsj(mensaje)
                console.log(mensaje)
                break
            case 100:
                mensaje = 'ATENCIÓN. El usuario está bloqueado'
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
        }
    
}
