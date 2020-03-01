const db = require( '../config/db')


const novoUsuario = {
    nome: 'Heider',
    email: "heider@gmail.com",
    senha: '12345678'
}

//update .. ('...').where({..}).update({})

async function exercicio() {
    //count
    const { qtde } = await db('usuarios').count('* as qtde').first()
    if(qtde === 0) {
        await db('usuarios').insert(novoUsuario)
    }

    let { id } = await db('usuarios').select('id').limit(1).first()
    
    await db('usuarios').where({ id }).update({
        nome: 'Heider Lopes'
    })

    return db('usuarios').where( {id} )

}

exercicio()
    .then(usuario => console.log(usuario))
    .finally(() => db.destroy())