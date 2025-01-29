import type { HttpContext } from '@adonisjs/core/http'

export default class ContactsController {
  /**
   * Display a list of resource
   */

  async index({ view }: HttpContext) {

    return view.render('accueil/contact')
  } 

  /**
   * Display form to create a new record
   */

  async create({}: HttpContext) {

  }

  /**
   * Handle form submission for the create action
   */
  async store({ request  }: HttpContext) {

  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {

  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {

  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params }: HttpContext) {

  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
  
  }

}