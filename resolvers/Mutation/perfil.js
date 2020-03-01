const db = require('../../config/db')
const { perfil: obterPerfil } = require( '../Query/perfil')

module.exports = {
    async novoPerfil(_, { dados }) {
        try {
            const [id] = await db('perfis').insert({...dados})
            return db('perfis').where({id}).first()
        } catch(error) {
            throw new Error(error.sqlMessage)
        }
    },
    async excluirPerfil(_, { filtro }) {
        try {
            const perfil = await obterPerfil(_, { filtro })
            
            if(perfil) {
                const { id } = perfil
                await db('usuarios_perfis').where({ perfil_id: id}).delete()
                await db('perfis').where({ id }).delete()
            }
            return perfil
        } catch(error) {
            throw new Error(error.sqlMessage)
        }
    },

    async alterarPerfil(_, { filtro, dados }) {
        try {
            const perfil = await obterPerfil(_, { filtro })
            
            if(perfil) {
                const { id } = perfil
                await db('perfis').where({ id }).update(dados)
            }
            return {...perfil, ...dados}
        } catch(error) {
            throw new Error(error.sqlMessage)
        }
    }
}