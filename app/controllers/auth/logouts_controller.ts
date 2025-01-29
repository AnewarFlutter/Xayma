import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutsController {
  /**
   * Display a list of resource
   */

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}