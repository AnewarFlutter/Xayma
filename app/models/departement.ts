import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Region from './region.js'
import Commune from './commune.js'

/**
 * Modèle Departement représentant un département administratif
 * @class
 * @extends BaseModel
 */
export default class Departement extends BaseModel {
  /**
   * Identifiant unique du département
   * @primary
   */
  @column({ isPrimary: true })
  declare id: number

  /**
   * Nom du département
   */
  @column()
  declare name: string

  /**
   * Identifiant de la région à laquelle appartient le département
   */
  @column()
  declare region_id: number

  /**
   * Date de création de l'enregistrement
   * @autoCreate
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /**
   * Date de dernière modification de l'enregistrement
   * @autoCreate
   * @autoUpdate
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relation avec la région parente
   * Un département appartient à une seule région
   */

  @belongsTo(() => Region, {
    foreignKey: 'region_id' // Spécifier le nom exact de la clé étrangère
  })

  declare region: BelongsTo<typeof Region>

  /**
   * Relation avec les communes
   * Un département peut avoir plusieurs communes
   */
  @hasMany(() => Commune)
  declare communes: HasMany<typeof Commune>
}