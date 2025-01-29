import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import FormeJuridique from './forme_juridiques.js'
import DomaineActivite from './domaines_activites.js'

export default class InfoEntreprise extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare id_user: string

  @column()
  declare code_demande: string

  @column()
  declare nom_entreprise: string | null

  @column()
  declare nom_representant: string | null
  
  @column()
  declare prenom_representant: string | null

  @column()
  declare adresse: string | null

  @column()
  declare email: string | null

  @column()
  declare telephone: string | null

  @column()
  declare rccm_file: string | null

  @column()
  declare ninea_file: string | null

  @column()
  declare declaration_file: string | null

  @column.date()
  declare date_adhesion: DateTime | null

  @column()
  declare forme_juridique_id: number | null

  @column()
  declare domaine_activite_id: number | null

  @column()
  declare autre_domaine: string | null

  @column()
  declare nb_cdi: number | null

  @column()
  declare nb_cdd: number | null

  @column()
  declare quitus_fiscal: string | null

  @column()
  declare quitus_social: string | null

  @column()
  declare nb_stagiaires: number | null

  @column()
  declare profils_recherches: string | null

  @column()
  declare carte_identite: string | null

  @column()
  declare renouvellement: number | null

  @column()
  declare appointment_date: string | null

  @column()

  declare reject_message: string | null

  @column()
  declare demande : number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => FormeJuridique, {
    foreignKey: 'forme_juridique_id' // Spécifier explicitement le nom de la colonne
  })
  declare formeJuridique: BelongsTo<typeof FormeJuridique>

  @belongsTo(() => DomaineActivite, {
    foreignKey: 'domaine_activite_id'
  })

  declare domaineActivite: BelongsTo<typeof DomaineActivite>
}