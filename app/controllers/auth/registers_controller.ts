import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
export default class RegistersController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    return view.render('auth/register')
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
 //generateOTP method to generate OTP
 private generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}


 //store method to register user
async store({ request, response, session, auth }: HttpContext) {
  try {
    const data = request.only([
      'name',
      'full_name',
      'email',
      'password',
      'password_confirmation',
      'role'
    ])

    // Validation du format du mot de passe
    const passwordRegex = /^[A-Z](?=.*\d).{7,}$/
    if (!passwordRegex.test(data.password)) {
      session.flash('errors', {
        password: 'Le mot de passe doit commencer par une majuscule et contenir au moins 8 caractères dont un chiffre'
      })
      return response.redirect().back()
    }

    // Vérification de la correspondance des mots de passe
    if (data.password !== data.password_confirmation) {
      session.flash('errors', { 
        password_confirmation: 'Les mots de passe ne correspondent pas'
      })
      return response.redirect().back()
    }

    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      session.flash('errors', { email: 'Cet email est déjà utilisé' })
      return response.redirect().back()
    }

    // Suppression de password_confirmation avant création
    delete data.password_confirmation

    const otp = this.generateOTP()
    const otp_expires_at = DateTime.now().plus({ minutes: 10 })

    const user = await User.create({
      name: data.name,
      full_name: data.full_name,
      email: data.email,
      password: data.password, // Vérifier que le hash est bien fait
      role: data.role || 'user',
      email_verified_at: null,
      remember_me_token: null
    })

    await auth.use('web').login(user)
    session.flash('success', 'Inscription réussie! Vous êtes maintenant connecté.')
    return response.redirect().toRoute('dashboard.index') // Redirection vers le dashboard après inscription

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    if (error.messages) {
      session.flash('errors', error.messages)
    } else {
      session.flash('errors', {
        error: 'Une erreur est survenue lors de l\'inscription'
      })
    }
    return response.redirect().back()
  }
}


}