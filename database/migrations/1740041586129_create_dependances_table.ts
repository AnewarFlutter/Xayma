import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dependances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('nature_des_dependances', 255)
      table.decimal('surface_reelle', 10, 2)
      table.integer('coefficient_eclairement_id').unsigned().references('id').inTable('eclairages')
      table.integer('coefficient_ventilation_id').unsigned().references('id').inTable('ventilations')
      table.decimal('coefficient_moyenne', 10, 2)
      table.decimal('produit', 10, 2)
      table.integer('coefficient_vetuste_id').unsigned().references('id').inTable('vertustes')
      table.integer('coefficient_anciennete_id').unsigned().references('id').inTable('anciennetes')
      table.decimal('surface_corrigee', 10, 2)
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
        })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}









 //====================== 2021-09-30 ======================
      //autres champs ajoutés pour une autre version de TABLE
      //table.decimal('report_equivalences', 10, 2)
      //table.decimal('coefficient_vetuste_equipement', 10, 2)
      //table.decimal('surface_corrigee_dependances', 10, 2)
      //table.string('classement_categorie', 1)
      //table.decimal('valeur_metre_carre', 12, 2)
      //table.decimal('valeur_dependances', 12, 2)
      //table.timestamp('created_at')
      //table.timestamp('updated_at')