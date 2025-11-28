import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  public async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  public async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    console.log('=== CONNEXION AVEC STOCKAGE SESSION ===')

    try {
      const user = await User.findBy('email', email)
      console.log('Utilisateur trouvé:', user ? `Oui (id: ${user.id})` : 'Non')

      if (!user) {
        session.flash('error', 'Email ou mot de passe incorrect')
        return response.redirect().back()
      }

      const isPasswordValid = await hash.verify(user.password, password)
      console.log(' Mot de passe valide:', isPasswordValid)

      if (!isPasswordValid) {
        session.flash('error', 'Email ou mot de passe incorrect')
        return response.redirect().back()
      }

      await auth.use('web').login(user)
      session.put('auth_user_id', user.id)
      session.put('auth_user_email', user.email)

      console.log('ID stocké en session:', user.id)
      console.log('Connexion réussie')

      session.flash('success', 'Connexion réussie!')
      return response.redirect('/tasks')
    } catch (error) {
      console.error(' Erreur connexion:', error)
      session.flash('error', 'Erreur de connexion')
      return response.redirect().back()
    }
  }

  public async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Déconnexion réussie!')
    return response.redirect('/login')
  }
}
