const bcrypt = require('bcrypt-nodejs')

const db = require('../../config/db')
const { usuario: obterUsuario } = require( '../Query/usuario')
const { perfil: obterPerfil } = require( '../Query/perfil')

const mutations = {

    registrarUsuario(_, {dados}) {
        return mutations.novoUsuario(_, {
            dados: {
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha
            }
        })
    },

    async novoUsuario(_, { dados }, ctx) {
        
        ctx && ctx.validarAdmin()
        
        try {
            const idsPerfis = []

            if(!dados.perfis || !dados.perfis.length) {
                dados.perfis = [{
                    nome: 'comum'
                }]
            }
            
            for (filtro of dados.perfis) {
                const perfil = await obterPerfil(_, {filtro})
                if(perfil) idsPerfis.push(perfil.id)
            }

            // delete dados.perfis
            // const [ id ] = await db('usuarios').insert({...dados})

            //Criptografar a senha
            const salt = bcrypt.genSaltSync()
            dados.senha = bcrypt.hashSync(dados.senha, salt)

            const [ id ] = await db('usuarios').insert({
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha
            })
            
            
            for(perfil_id of idsPerfis) {
                await db('usuarios_perfis').insert({perfil_id, usuario_id: id})
            }

            return db('usuarios').where({id}).first()

        } catch(error) {
            throw new Error(error.sqlMessage)
        }
    },
    async excluirUsuario(_, { filtro }, ctx) {
        
        ctx && ctx.validarAdmin()

        try {
            const usuario = await obterUsuario(_, { filtro })
            if(usuario) {
                const { id } = usuario            
                await db('usuarios_perfis').where({usuario_id: id}).delete()
                await db('usuarios').where({id}).delete()
            }
            return usuario
        }catch(e) {
            throw new Error(e);
        }
    },

    async alterarUsuario(_, { filtro, dados }, ctx) {
        
        ctx && ctx.validarUsuarioFiltro( filtro )

        try {
            const usuario = await obterUsuario(_, { filtro })
            if(usuario) {
                const { id } = usuario            
                if(dados.perfis) {
                    await db('usuarios_perfis')
                        .where({usuario_id: id}).delete()

                    for(let filtro of dados.perfis) {
                        const perfil = await obterPerfil(_, {filtro})
                        if(perfil) {
                            await db('usuarios_perfis').insert({
                                perfil_id: perfil.id,
                                usuario_id: id
                            })
                        }
                    }
                }

                if(dados.senha) {
                    //Criptografar a senha
                    const salt = bcrypt.genSaltSync()
                    dados.senha = bcrypt.hashSync(dados.senha, salt)
                }

                delete dados.perfis
                await db('usuarios').where({id}).update(dados)
            }

            return !usuario ? null :  {...usuario, ...dados}
        }catch(e) {
            throw new Error(e);
        }
    }
}

module.exports = mutations;