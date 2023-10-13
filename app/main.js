const loadInitialTemplate = () => {
    const template = `
    <h1>Usuarios</h1>
    <form id="user-form">
        <div>
            <label for="">Nombre</label>
            <input type="text" name="name">
        </div>
        <div>
            <label for="">Apellido</label>
            <input type="text" name="lastname">
        </div>
        <button type="submit">Enviar</button>
    </form>
    <a href="#" id="logout">Cerrar sesiòn</a>
    <ul id="user-list"></ul>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const getUsers = async () => {
    const response = await fetch('/users',{
        headers: {
            Authorization: localStorage.getItem('jwt'),
        }
    })
    console.log(response)
    const users = await response.json() //.json() toma un json y lo convierte en un objeto javascript
    console.log(users)
    const template = user => `
    <li>
        ${user.name} ${user.lastname} <button data-id = "${user._id}">Eliminar</button> 
    </li>
    `
    const userList = document.getElementById('user-list')
    userList.innerHTML = users.map(user => template(user)).join('')

    //Eliminar elemento de la lista y BD
    users.forEach(user => {
        const userNode=document.querySelector(`[data-id="${user._id}"]`)
        console.log(userNode)
        userNode.onclick = async e => {
            e.preventDefault()
            await fetch(`/users/${user._id}`,{
                method: 'DELETE',
                headers : {
                    Authorization: localStorage.getItem('jwt')
                }
            })
            userNode.parentNode.remove()
            console.log(`Usuario ${user._id} eliminado con èxito`)
            alert('Eliminado con èxito')
        }
    });
    
    /* Otra opcion de iterar los elementos de un arreglo, en este caso el array users
    userList.innerHTML = "";
    for (let x of users){
        userList.innerHTML += `
        <li>
        ${x.name} ${x.lastname} <button data-id = ${x._id}>Eliminar</button> </br>
        </li>
        `
    }*/
}

const addFormListener = () => {
    const userForm = document.getElementById('user-form')
    userForm.onsubmit = async (e) => {
        e.preventDefault() // asi la pagina no se refresca cuando clickeamos el boton de submit
        const formData = new FormData(userForm)//FormData es un objeto que nos permite obtener los valores de un form siempre y cuando le pasemos como argumento una referencia
        const data = Object.fromEntries(formData.entries()) //de esta forma pasamos los valores de nuestro form a un objeto
        console.log(data)
        const response = await fetch('/users', {
            method: 'POST',
            body: JSON.stringify(data), //stringify convierte un objeto de javascript a formato string (json)
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('jwt'),
            }
        })

        const responseData = await response.text()
        console.log(responseData)
        if (response.status == 404) {
            alert(responseData);
        } else {
            console.log(responseData)
            alert("Usuario agregado exitosamente")
        }

        userForm.reset()
        getUsers()
    }
}

const usersPage = () => {
    loadInitialTemplate()
    addFormListener()
    getUsers()
    logoutOption()
}

const loadRegisterTemplate = () => {
    const template = `
    <h1>Register</h1>
    <form id="register-form">
        <div>
            <label for="">Correo</label>
            <input type="text" name="email">
        </div>
        <div>
            <label for="">Contraseña</label>
            <input type="text" name="password">
        </div>
        <button type="submit">Enviar</button>
    </form>
    <a href="#" id="login">Iniciar sesiòn</a>
    <div id="error-register"></div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const addRegisterListener = () => {
    const registerForm = document.getElementById('register-form')
    registerForm.onsubmit = async(e) => {
        e.preventDefault()
        const formData = new FormData(registerForm)
        const data = Object.fromEntries(formData.entries())

        const response = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        const responseData = await response.text()
        console.log(responseData)
        if (response.status >= 300) {
            const errorNode = document.getElementById('error-register')
            errorNode.innerHTML = responseData
        } else {
            console.log(responseData)
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            usersPage()
        }
    }
}

const gotoLoginListener = () => {
    const gotoLogin = document.getElementById('login')
    console.log(gotoLogin)
    gotoLogin.onclick = (e) => {
        e.preventDefault()
        loginPage()
    }
}

const registerPage = () => {
    console.log('Pagina de registro')
    loadRegisterTemplate()
    addRegisterListener()
    gotoLoginListener()
}


const checkLogin = () => {
    const token = localStorage.getItem('jwt')
    return token
}

const loadLoginTemplate = () => {
    const template = `
    <h1>Login</h1>
    <form id="login-form">
        <div>
            <label for="">Correo</label>
            <input type="text" name="email">
        </div>
        <div>
            <label for="">Contraseña</label>
            <input type="text" name="password">
        </div>
        <button type="submit">Enviar</button>
    </form>
    <a href="#" id="register">Registrarse</a>
    <div id="error"></div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const addLoginListener = () => {
    const loginForm = document.getElementById('login-form')
    loginForm.onsubmit = async(e) => {
        e.preventDefault()
        const formData = new FormData(loginForm)
        const data = Object.fromEntries(formData.entries())

        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const responseData = await response.text()
        if (response.status >= 300) {
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else {
            console.log(responseData)
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            usersPage()
        }
    }
}

const gotoRegisterListener = () => {
    const gotoRegister = document.getElementById('register')
    console.log(gotoRegister)
    gotoRegister.onclick = (e) => {
        e.preventDefault()
        registerPage()
    }
}

const loginPage = () => {
    loadLoginTemplate()
    addLoginListener()
    gotoRegisterListener()
}

const logoutOption = () => {
    const logout = document.getElementById('logout')
    logout.onclick = (e) => {
        e.preventDefault()
        localStorage.removeItem("jwt")
        loginPage()
    }
    
}


window.onload = () => {
    const isLoggedIn = checkLogin()
    if (isLoggedIn) {
        usersPage()
        logoutOption()
    } else {
        loginPage()
    }
}