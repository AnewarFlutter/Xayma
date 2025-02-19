import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('auth/login')
  }



   async login({ request, auth, response, session }: HttpContext) {
     try {
       const { email, password } = request.only(['email', 'password'])
       
       // Vérification des identifiants
       const user = await User.verifyCredentials(email, password)
       
       // Connexion directe sans vérification d'email
       await auth.use('web').login(user)
       
       // Redirection selon le rôle
       return user.role === 'admin' 
         ? response.redirect('/admin/dashboard')
         : response.redirect('/dashboard')
  
     } catch (error) {
       session.flash('errors', { login: 'Email ou mot de passe invalide' })
       return response.redirect().back()
     }
   }

  
}