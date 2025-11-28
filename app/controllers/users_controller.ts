import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  /** Liste des utilisateurs */
  public async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('users/index', { users })
  }

  /** Détails d’un utilisateur et ses tâches */
  public async show({ params, view }: HttpContext) {
    const user = await User.query().where('id', params.id).preload('tasks').firstOrFail()

    return view.render('users/show', { user })
  }

  /** Formulaire de création */
  public async create({ view }: HttpContext) {
    return view.render('users/create')
  }

  /** Enregistrer un nouvel utilisateur */
  public async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['nom', 'email', 'password'])

      if (!data.nom || !data.email || !data.password) {
        session.flash('error', 'Tous les champs sont requis')
        return response.redirect().back()
      }

      data.password = await hash.make(data.password)

      await User.create(data)

      session.flash('success', 'Utilisateur créé avec succès !')
      return response.redirect('/users')
    } catch (error) {
      console.error('Erreur création utilisateur :', error)
      session.flash('error', 'Erreur lors de la création de l’utilisateur')
      return response.redirect().back()
    }
  }

  /** Formulaire d’édition */
  public async edit({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('users/edit', { user })
  }

  /** Mettre à jour un utilisateur */
  public async update({ params, request, response, session }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const data = request.only(['nom', 'email'])
      const password = request.input('password')

      if (!data.nom || !data.email) {
        session.flash('error', 'Nom et email sont requis')
        return response.redirect().back()
      }

      user.nom = data.nom
      user.email = data.email

      if (password && password.trim() !== '') {
        user.password = await hash.make(password)
      }

      await user.save()
      session.flash('success', 'Utilisateur mis à jour avec succès !')
      return response.redirect('/users')
    } catch (error) {
      console.error('Erreur mise à jour utilisateur :', error)
      session.flash('error', 'Erreur lors de la mise à jour')
      return response.redirect().back()
    }
  }

  /** Supprimer un utilisateur */
  public async destroy({ params, response, session }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      session.flash('success', 'Utilisateur supprimé avec succès !')
    } catch (error) {
      console.error('Erreur suppression utilisateur :', error)
      session.flash('error', 'Impossible de supprimer cet utilisateur')
    }

    return response.redirect('/users')
  }
}
