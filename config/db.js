const config = require('../knexfile');

//Gerando uma instancia do knex
module.exports = require('knex') (config)