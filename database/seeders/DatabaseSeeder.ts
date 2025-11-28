import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserSeeder from './user_seeder.js'
import TaskSeeder from './task_seeder.js'

export default class DatabaseSeeder extends BaseSeeder {
  async run() {
    // Créez d'abord les instances des seeders
    const userSeeder = new UserSeeder(this.client)
    const taskSeeder = new TaskSeeder(this.client)
    
    // Exécutez d'abord le user seeder
    await userSeeder.run()
    
    // Ensuite le task seeder
    await taskSeeder.run()
  }
}