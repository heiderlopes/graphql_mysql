const db = require('../config/db')

// db('perfis')
//     .map(p => p.nome)
//     .then(nome => console.log(nome))
//     .catch(err => console.log(err.sqlMessage))
//     .finally(() => db.destroy())


// db('perfis')
//     .select( 'nome', 'id')
//     .then(nome => console.log(nome))
//     .catch(err => console.log(err.sqlMessage))
//     .finally(() => db.destroy())


// db.select('nome')
//     .from('perfis')
//     .limit(4).offset(2)
//     .then(nome => console.log(nome))
//     .catch(err => console.log(err.sqlMessage))
//     .finally(() => db.destroy())


db('perfis')
    //.where( {id: 2})
    //.where( 'id', '=', 2)
    //.where( 'nome', 'like', '%min%')
    //.whereNot( 'nome', 'like', '%min%')
    .whereIn('id', [1, 2, 3])
    //.first()
    .then(res => console.log(res))
    .catch(err => console.log(err.sqlMessage))
    .finally(() => db.destroy())

