
exports.up = function(knex) {
    return knex.schema.createTable('usuarios_perfis', table => {
        table.integer('usuario_id').unsigned().notNullable()
        table.integer('perfil_id').unsigned().notNullable()
        table.foreign('usuario_id').references('usuarios.id')
        table.foreign('perfil_id').references('perfis.id')
        table.primary(['usuario_id', 'perfil_id'])
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('usuarios_perfis')
  };
  