import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Eclairage from './eclairage.js'
import Ventilation from './ventilation.js'
import Vertuste from './vertuste.js'
import Anciennete from './anciennete.js'

export default class Dependance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare user_id: number

  @column()
  declare nature_des_dependances: string

  @column()
  declare surface_reelle: number

  @column()
  declare coefficient_eclairement_id: number

  @column() 
  declare coefficient_ventilation_id: number

  @column()
  declare coefficient_moyenne: number

  @column()
  declare produit: number

  @column()
  declare coefficient_vetuste_id: number

  @column()
  declare coefficient_anciennete_id: number

  @column()
  declare surface_corrigee: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Eclairage, {
    foreignKey: 'coefficient_eclairement_id'
  })
  declare eclairage: BelongsTo<typeof Eclairage>

  @belongsTo(() => Ventilation, {
    foreignKey: 'coefficient_ventilation_id'
  })
  declare ventilation: BelongsTo<typeof Ventilation>

  @belongsTo(() => Vertuste, {
    foreignKey: 'coefficient_vetuste_id'
  })
  declare vertuste: BelongsTo<typeof Vertuste>

  @belongsTo(() => Anciennete, {
    foreignKey: 'coefficient_anciennete_id'
  })
  declare anciennete: BelongsTo<typeof Anciennete>
}