import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Commune from './commune.js'  // Retirez le mot-clé 'type'
import Secteur from './secteur.js'

export default class Ville extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare name: string
  
  @column()
  declare commune_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Commune, {
    foreignKey: 'commune_id'
  })
  declare commune: BelongsTo<typeof Commune>

  @hasMany(() => Secteur)
  declare secteurs: HasMany<typeof Secteur>
}