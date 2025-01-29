import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'info_entreprises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // ID et timestamps
      table.increments('id')
      
      // Informations de l'entreprise (Formulaire 1)
      table.string('id_user').notNullable()
      table.string('code_demande').notNullable()
      table.string('nom_entreprise').nullable()
      table.string('nom_representant').nullable()
      table.string('prenom_representant').nullable() 
      table.string('adresse').nullable()
      table.string('email').nullable()
      table.string('telephone', 9).nullable()

      // Documents légaux (Formulaire 2)
      table.string('rccm_file').nullable() // Chemin du fichier
      table.string('ninea_file').nullable() // Chemin du fichier
      table.string('declaration_file').nullable() // Chemin du fichier
      table.date('date_adhesion').nullable()
      table.integer('demande')
      table.integer('renouvellement') // En attente, Validé, Refusé
      table.dateTime('appointment_date')
      table.text('reject_message')
      
      // Clés étrangères
      table.integer('forme_juridique_id')
        .unsigned()
        .references('id')
        .inTable('forme_juridiques')
        .onDelete('SET NULL')
      
      table.integer('domaine_activite_id')
        .unsigned()
        .references('id')
        .inTable('domaines_activites')
        .onDelete('SET NULL')
        
      table.string('autre_domaine').nullable()

      // Effectif et Documents (Formulaire 3)
      table.integer('nb_cdi').nullable()
      table.integer('nb_cdd').nullable() 
      table.string('quitus_fiscal').nullable() // Chemin du fichier
      table.string('quitus_social').nullable() // Chemin du fichier
      table.integer('nb_stagiaires').nullable()
      table.text('profils_recherches').nullable()
      table.string('carte_identite').nullable() // Chemin du fichier
      
      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}