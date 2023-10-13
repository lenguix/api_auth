const express = require('express')
const mongoose = require('mongoose')
const user = require('./user.controller') //Refactorizado de endpoints
const app = express()
const { Auth, isAuthenticated } = require('./auth.controller')
const port = 3000

//funcion que se ejecute cuand realizemos cualquier peticion (osea siempre), esto se conoce como mdw y se utiizan para realizar validaciones 
//y poder sacar los datos que vienen atraves de una peticion de POST e inyectarlos en la propiedad de body en nuestro objeto de request
//agarra todas las peticiones que vienen en json y las convierte en un objeto JS y las asigna a la propiedad de body
app.use(express.json())   

//conexion hacia la bd de mongo
mongoose.connect('mongodb+srv://luiferenguix23:asdf123@cluster0.khmi3eb.mongodb.net/project-users?retryWrites=true&w=majority')


/* http status between 200 and 299
    200 -> ok and respoonse an object or anything
    201 -> ok created and responde with an id
    204 -> ok but no content (to response)
*/

/*
app.get('/', (req,res)=> {
    res.status(200).send('Hola Mundo!')
})

app.post('/', (req,res)=>{
    res.status(201).send('Creando item')
})

*/

//Refactorizado de endpoints
app.get('/users',isAuthenticated,user.list)
app.get('/users/:id',isAuthenticated,user.get)
app.post('/users',isAuthenticated,user.create)
app.put('/users/:id',isAuthenticated,user.update)
app.delete('/users/:id',isAuthenticated,user.destroy)

app.post('/login',Auth.login)
app.post('/register',Auth.register)

//app.use -> MDW
app.use(express.static('app'))//va a buscar a una carpeta todos los archivos que estàn dentro de ella. En este caso con esto llama al archivo /app/main.js que es invocado por el html


app.get('/',(req,res)=>{
    console.log(__dirname)//__dirname, indica en que carpeta se ejecuta el script api.js
    res.sendFile(`${__dirname}/index.html`)
})

//Capturando todas las peticiones (get). 
//Para post y demas verbos no hace sentido ya que "nadie" va a llamarlos desde un explorador
//estos llamados solo se harian por postman y un usuario normal ya sabe que hace en postman
/*app.get('*',(req,res) => {
    res.status(404).send('Ruta no existe')
})*/

app.listen (port, ()=> {
    console.log('Running...')
})