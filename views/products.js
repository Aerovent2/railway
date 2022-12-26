

const productosFetch=[]
/*  fetch('/api/productos-test')
.then((response)=>response.json())
.then((json)=>productosFetch.push(json)); */
let usuario=""
fetch('/user')
.then((response)=>response.json())
.then((res)=>{
  
  usuario= res.usuario
  saludo.innerText="Bienvenido "+ usuario
});

const view= `
<div class="container  mt-3">
        <h1>Cargar Nuevo Producto</h1>
        
        <form  onsubmit="return enviarProducto(this)" class="row g-3">
            <input id="title" type="text" placeholder="Ingrese titulo" name="title" class="form-control">
            <input id="thumbnail" type="text" placeholder="Ingrese url imagen" name="thumbnail" class="form-control">
            <input id="price" type="number" placeholder="Ingrese precio" name="price" class="form-control">
            <input id="submit" type="submit" value="enviar" class="btn btn-primary mb-3">
        </form>

`
const viewMensajes=`
<div class="container mb-5" >
  <h2>Nuevo Mensaje</h2>
  <form onsubmit="return enviarMensaje(this)">
    
        <div class="input-group-append">
          <input
            type="email"
            class="form-control"
            placeholder="email..."
            id="email"
            required
          />
        </div>

          <div class="input-group-append">
             <input
                type="text"
                class="form-control"
                placeholder="Nombre.."
                id="nombreChat"
                required
               />
          </div>

          <div class="input-group-append">
              <input
                type="text"
                class="form-control"
                placeholder="Apellido..."
                id="apellidoChat"
                required
              />
          </div>

          <div class="input-group-append">
            <input
              type="number"
              class="form-control"
              placeholder="Edad..."
              id="edadChat"
              required
            />
          </div>

          <div class="input-group-append">
            <input
              type="text"
              class="form-control"
              placeholder="Alias..."
              id="aliasChat"
              required
            />
          </div>
          
          <div class="input-group-append">
          <input
          type="text"
          class="form-control"
          placeholder="Avatar..."
          id="avatarChat"
          required
          />
          </div>
          
          <div class="input-group-append">
          <input
            type="text"
            class="form-control"
            placeholder="Mensaje..."
            id="mensajeChat"
            required
          />
        </div>
          
          <input id="submit2" type="submit" value="enviar" class="btn btn-primary mb-3">
</div>


`


const viewProductos= `
<h1>View Productos</h1>
<div class="container mt-3">
{{#if productos}}
<table  class="table table-primary" align="center">
    <thead>
        <tr class="table-dark">
            <th>Producto</th>
            <th>Precio</th>
            <th>Miniatura</th>
        </tr>
    </thead>
    {{#each productos}}
        <tr> 
            <td class="table-info">{{this.title}}</td>
            <td class="table-success"> {{this.price}}</td>
            <td class="table-warning"><img style="height: 30px" class="img-fluid" src="{{this.thumbnail}}" alt="imagen"/></td>
        </tr>
    {{/each}}
</table>
{{else}}
<p>No hay productos cargados</p>

{{/if}}

`
const viewListaMensajes= `
<h1>Historial Mensajes</h1>
<div class="container mt-3">
{{#if mensajes}}
<div>
    {{#each mensajes}}
      <i style="color:green">{{this.author}} </i><i>------>>>>>></i>  <strong style="color:blue">{{this.text}}</strong><br>
        
    {{/each}}
</div>
{{else}}
<p>No hay Mensajes </p>

{{/if}}

`



const viewController= Handlebars.compile(view)
const viewHtml =viewController()
document.getElementById('divCargaProductos').innerHTML = viewHtml


const msgController= Handlebars.compile(viewMensajes)
const msgHtml =msgController()
document.getElementById('divMensaje').innerHTML = msgHtml





///////////////////////////////////////////////////////////////////


const title = document.getElementById('title')
const price = document.getElementById('price')
const thumbnail = document.getElementById('thumbnail')


const mensajes = document.getElementById('mensajes')
const mensaje = document.getElementById('mensajeChat')
const email = document.getElementById('email')
const nombre = document.getElementById('nombreChat')
const apellido = document.getElementById('apellidoChat')
const edad = document.getElementById('edadChat')
const alias = document.getElementById('aliasChat')
const avatar = document.getElementById('avatarChat')


const salir = document.getElementById('salir')
const saludo=document.getElementById('saludo')



salir.addEventListener('click',(e)=>{
  e.preventDefault();
  saludo.innerText='Hasta Luego '+ usuario
  setTimeout(function() {
    window.location.href = "/logout";
  }, 2000);
})





const enviarProducto= (event)=>{
  
    socket.emit('new-prod',{title:title.value, price:price.value,thumbnail:thumbnail.value})
    title.value = ''
    price.value = ''
    thumbnail.value = ''
    return false
}

const enviarMensaje= (event)=>{

    socket.emit('new-msj',{
      author:{
        id:email.value,
        nombre:nombre.value,
        apellido:apellido.value,
        edad:edad.value,
        alias:alias.value,
        avatar:avatar.value,

      },      
      text:mensaje.value
    })
  
   mensaje.value = ''  
   return false
}


const socket = io.connect()

socket.on('productos', (datosEmit)=>{
 productosFetch[0]=datosEmit
 
    productos= {productos:productosFetch[0]}

    const prodController= Handlebars.compile(viewProductos)
    const prodHtml =prodController(productos)
    document.getElementById('divProductos').innerHTML = prodHtml
})



const messageSchema = new normalizr.schema.Entity('mensajes')
const authorSchema= new normalizr.schema.Entity('autores')


const mySchema = [
    {   
        'text':[messageSchema],
        "author":authorSchema,
    }
]


socket.on('mensajes', (datosEmit)=>{
  const objDenormaliz = normalizr.denormalize(datosEmit.result,mySchema,datosEmit.entities)

    const original =JSON.stringify(objDenormaliz).length 
    let normalizado = JSON.stringify(datosEmit).length
    let compresion= 100 -Math.floor((normalizado/original)*100)
    console.log(`tamaño original:${original}  tamaño normalizado:${normalizado}, compresion:${compresion}%`)

   
    const mensajes= {mensajes:datosEmit.result}
    const msgListController= Handlebars.compile(viewListaMensajes)
    const msgListHtml =msgListController(mensajes)
    document.getElementById('divHistorialMensajes').innerHTML = msgListHtml
})



