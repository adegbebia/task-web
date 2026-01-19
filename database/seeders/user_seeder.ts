import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.query().delete()

    await User.createMany([
      {
        nom: 'Traoré',
        email: 'traoredegbebia@gmail.com',
        password: '123456',
        role: 'user', // Ajout du rôle pour l'utilisateur
      },
      {
        nom: 'Admin',
        email: 'admin@ifnti.tg',
        password: 'admin123',
        role: 'admin', // Ajout du rôle pour l'administrateur
      },
    ])
  }
}
