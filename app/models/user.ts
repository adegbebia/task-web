// app/models/user.ts
import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import type { HasMany } from '@adonisjs/lucid/types/relations'
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

  @hasMany(() => Task)
  declare tasks: HasMany<typeof Task>


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
