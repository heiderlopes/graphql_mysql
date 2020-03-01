const db = require('../config/db')

db('usuarios').where({id: 1})
    .delete()
    .then(res => console.log(res))
    .catch(error => console.log(error))
    .finally(() => db.destroy())
