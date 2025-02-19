import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Region from './region.js'
import Departement from './departement.js'
import Commune from './commune.js'
import Secteur from './secteur.js'
import Ville from './ville.js'

export default class LocalisationAdministratives extends BaseModel {
  // Correction du nom de la classe (typo)
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare code: string

  @column()
  declare code_agent: string

  @column()
  declare region_id: number
  
  @column()
  declare ville_id: number  // Ajout de cette ligne

  @column()
  declare departement_id: number

  @column()
  declare commune_id: number

  @column()
  declare secteur_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Region, {
    foreignKey: 'region_id'
  })
  declare region: BelongsTo<typeof Region>

  @belongsTo(() => Departement, {
    foreignKey: 'departement_id'
  })
  declare departement: BelongsTo<typeof Departement>

  @belongsTo(() => Commune, {
    foreignKey: 'commune_id'
  })
  declare commune: BelongsTo<typeof Commune>

  @belongsTo(() => Ville, {
    foreignKey: 'ville_id'
  })
  declare ville: BelongsTo<typeof Ville>
  

  @belongsTo(() => Secteur, {
    foreignKey: 'secteur_id'
  })
  declare secteur: BelongsTo<typeof Secteur>
}