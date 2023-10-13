const Users = require('./User')

const User = {
    get: async (req, res) => {
        console.log(req.params)
        const { id } = req.params //object destructuring
        const user = await Users.findOne({ _id: id })
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(404).send('No existe usuario con ese Id')
        }

    },
    list: async (req, res) => {
        const users = await Users.find()
        res.status(200).send(users)
    },
    create: async (req, res) => {
        console.log(req.body)
        console.log(req.method)

        const { name, lastname } = req.body

        try {
            if ((name || lastname) === '') {
                console.log('Nombre y Apellido son requeridos')
                res.status(404).send('Nombre y Apellido son requeridos')
            } else {
                const user = new Users(req.body)
                const savedUser = await user.save()
                res.status(201).send(savedUser._id)
            }
        } catch (e) {
            res.status(500).send(e.message)
        }

    },
    update: async (req, res) => {
        const { id } = req.params
        const user = await Users.findOne({ _id: id })
        Object.assign(user, req.body)
        await user.save()
        //res.status(204).send('Actualizando Item')
        res.sendStatus(204)
    },
    destroy: async (req, res) => {
        const { id } = req.params //object destructuring
        const user = await Users.findOne({ _id: id })
        if (user) {
            await user.deleteOne()
            console.log(`Usuario ${id} eliminado con èxito`)
            res.sendStatus(204)
        } else {
            console.log("No existe objeto para eliminar")
            res.sendStatus(404)
        }

    }
}

module.exports = User