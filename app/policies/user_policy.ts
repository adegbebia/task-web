import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
  /**
   * Seul un admin peut voir la liste des utilisateurs
   */
  async viewList(user: User): Promise<AuthorizerResponse> {
    return user.role === 'admin'
  }

  /**
   * Seul un admin peut créer un utilisateur
   */
  async create(user: User): Promise<AuthorizerResponse> {
    return user.role === 'admin'
  }

  /**
   * Seul un admin peut modifier un utilisateur
   */
  async edit(user: User): Promise<AuthorizerResponse> {
    return user.role === 'admin'
  }

  /**
   * Seul un admin peut supprimer un utilisateur
   */
  async delete(user: User): Promise<AuthorizerResponse> {
    return user.role === 'admin'
  }
}
