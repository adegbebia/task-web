import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Task from './task.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nom: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  // Tâches créées par l'utilisateur
  @hasMany(() => Task)
  declare tasks: HasMany<typeof Task>

  // Tâches où l'utilisateur est collaborateur
  @manyToMany(() => Task, {
    pivotTable: 'collaborators',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'task_id',
  })
  declare collaborations: ManyToMany<typeof Task>

  serialize() {
    return {
      id: this.id,
      nom: this.nom,
      email: this.email,
      createdAt: this.createdAt.toISO(),
      updatedAt: this.updatedAt.toISO(),
    }
  }

  toJSON() {
    return this.serialize()
  }
}
