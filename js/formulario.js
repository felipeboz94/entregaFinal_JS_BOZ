//----------------------------VARIABLES, CONSTANTES Y DEFINICION DE OBJETOS ----------------------------
const PATH_USUARIOS_REGISTRADOS = "../json/usuariosRegistrados.json"
let botGuardar = document.getElementById('botGuardar')
botGuardar.addEventListener('click',submit)
let botCancelar = document.getElementById('botCancelar')
botCancelar.addEventListener('click',cancelar)

//constructor de objeto USUARIO
function Usuario(nombre, apellido, mail, usuario, pass, estado, intentos){
    this.nombre = nombre
    this.apellido = apellido
    this.mail = mail
    this.usuario = usuario
    this.pass = pass
    this.estado = estado
    this.intentos = intentos
}

//----------------------------FUNCIONES----------------------------

//A LOGIN

function aLogin(){
    window.location.href='../login.html'
}

//LIMPIA LAS CAJAS DEL HTML

function limpiaCajas(){
    let inputs = document.getElementsByClassName('input')
    if(inputs.length != 0){
        for (const input of inputs){
            input.value = ""
        }
    }    
}

//EL BOTON CANCELAR LIMPIA LAS CAJAS Y SE VA AL LOGIN

function cancelar(){
    limpiaCajas()
    aLogin()
}

//MENSAJE CON SWEET ALERT DE CARGA EXITOSA

function cargaExitosa(){
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Usuario guardado con éxito',
        showConfirmButton: true,
        timer: 50000
      })
      .then((result) => {
        aLogin()
    } )
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

// VALIDA USUARIO INGRESADO CON LOS REGISTRADOS

function validacion(usuarioIngresado,auxiliarArrayUsuarios){

    let indiceUsuario = determinaIndice('usuario', usuarioIngresado.usuario,auxiliarArrayUsuarios)
    const aux = indiceUsuario > -1 ? 1 : 0// el usuario existe
    return aux
    
}

//REGISTRA EL USUARIO NUEVO DEL FORMULARIO EN LA VARIABLE LOCAL DE usuariosRegistrados

function registraUsuario(usuarioIngresado,auxiliarArrayUsuarios){
    const usuarioNuevo =  [{     
        nombre: usuarioIngresado.nombre,
        apellido: usuarioIngresado.apellido,
        mail: usuarioIngresado.mail,
        usuario:usuarioIngresado.usuario,
        pass:usuarioIngresado.pass,
        estado:usuarioIngresado.estado,
        intentos:usuarioIngresado.intentos
}]  
    let listaAuxiliar = [...auxiliarArrayUsuarios, ...usuarioNuevo] //SPREAD
    console.log("listaAuxiliar "+listaAuxiliar)
    localStorage.setItem('usuariosRegistrados',JSON.stringify(listaAuxiliar))

    return 1 
}

//FUNCIÓN DE SUBMIT QUE TOMA LAS INPUTS, VALIDA LA CARGA Y VA A cargaExitosa

function submit(){
    let inputNombre = document.getElementById('inputNombre')
    let inputApellido = document.getElementById('inputApellido')
    let inputMail = document.getElementById('inputMail')
    let inputUser = document.getElementById('inputUser')
    let inputPass = document.getElementById('inputPass')
    let bloqueado = 0
    let intentos = 0
    let reg = 0
    let usuarioIngresado = new Usuario(inputNombre.value,
        inputApellido.value,
        inputMail.value,
        inputUser.value,
        inputPass.value,
        bloqueado,
        intentos)
    let auxiliarArrayUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    let validado = validacion(usuarioIngresado,auxiliarArrayUsuarios)
    validado == 0 ? reg = registraUsuario(usuarioIngresado,auxiliarArrayUsuarios) : console.log("El usuario ingresado ya existe")
    reg == 1 && cargaExitosa()

}