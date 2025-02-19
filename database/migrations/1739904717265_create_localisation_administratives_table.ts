import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'localisation_administratives'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').notNullable()
      table.string('code_agent').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('region_id').unsigned().references('id').inTable('regions').onDelete('CASCADE')
      table.integer('departement_id').unsigned().references('id').inTable('departements').onDelete('CASCADE')
      table.integer('commune_id').unsigned().references('id').inTable('communes').onDelete('CASCADE')
      table.integer('ville_id').unsigned().references('id').inTable('villes').onDelete('CASCADE')
      table.integer('secteur_id').unsigned().references('id').inTable('secteurs').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}