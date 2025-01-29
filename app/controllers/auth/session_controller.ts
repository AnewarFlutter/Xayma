import { DateTime } from 'luxon'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class SessionController {

  //index method to render login view

 async index({ view }: HttpContext) {
   return view.render('auth/login')
 }


  //register method to render register view

 async register({ view }: HttpContext) {
   return view.render('auth/register')
 }


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
       'role'
     ])

     const existingUser = await User.findBy('email', data.email)
     if (existingUser) {
       session.flash('errors', { email: 'Cet email est déjà utilisé' })
       return response.redirect().back()
     }

     const otp = this.generateOTP()
     const otp_expires_at = DateTime.now().plus({ minutes: 10 })

     const user = await User.create({
       name: data.name,
       full_name: data.full_name,
       email: data.email,
       password: await hash.make(data.password),
       role: data.role || 'user',
       otp: otp,
       otp_expires_at: otp_expires_at,
       email_verified_at: null,
       remember_me_token: null
     })

     await mail.send((message) => {
       message
         .from(process.env.MAIL_FROM_ADDRESS || 'noreply@example.com')
         .to(user.email)
         .subject('Code de vérification - Direction de l\'Emploi')
         .htmlView('entreprise/mail/otp', { code: otp })
     })

     await auth.use('web').login(user)
     session.flash('success', 'Inscription réussie. Veuillez vérifier votre email.')
     return response.redirect().toRoute('verification.otp')

   } catch (error) {
     console.error('Erreur lors de l\'inscription:', error)
     session.flash('errors', { 
       error: 'Une erreur est survenue lors de l\'inscription' 
     })
     return response.redirect().back()
   }
 }


  //login method to login user
 async login({ request, auth, response, session }: HttpContext) {
   const { email, password } = request.only(['email', 'password'])
   
   try {
     const user = await User.verifyCredentials(email, password)
     
     if (!user.email_verified_at) {
       session.flash('warning', 'Veuillez vérifier votre email')
       return response.redirect().toRoute('verification.otp')
     }

     await auth.use('web').login(user)

     return user.role === 'admin' 
       ? response.redirect('/admin/dashboard')
       : response.redirect('/dashboard')

   } catch (error) {
     session.flash('errors', { login: 'Identifiants invalides' })
     return response.redirect().back()
   }
 }


  //logout method to logout user
 async logout({ auth, response }: HttpContext) {
   await auth.use('web').logout()
   return response.redirect('/login')
 }
}