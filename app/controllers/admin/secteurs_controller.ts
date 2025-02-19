import type { HttpContext } from '@adonisjs/core/http'
import Secteur from '#models/secteur'
import Ville from '#models/ville'

export default class SecteursController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    var villes = await Ville.all()
    return view.render('admin/secteurs/view_secteurs', { villes: villes })
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    const secteurs = await Secteur.query()
      .preload('ville')
      .exec()
       
    const secteursWithVille = secteurs.map((secteur) => {
      return {
        id: secteur.id,
        name: secteur.name,
        ville_name: secteur.ville.name,
        ville_id: secteur.ville_id
      }
    })

    return response.json(secteursWithVille)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['name', 'ville_id'])

      const existingSecteur = await Secteur.findBy('name', data.name)
      if (existingSecteur) {
        session.flash('error', 'Un secteur avec ce nom existe déjà')
        return response.redirect().back()
      }

      await Secteur.create(data)

      session.flash('success', 'Secteur ajouté avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Une erreur est survenue lors de l\'ajout du secteur')
      return response.redirect().back()
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params, response }: HttpContext) {
    try {
      const secteur = await Secteur.find(params.id)
      
      if (!secteur) {
        return response.status(404).json({
          status: 404,
          message: 'Secteur non trouvé'
        })
      }

      return response.json({
        status: 200,
        secteur: secteur
      })

    } catch (error) {
      console.error('Erreur lors de la récupération:', error)
      return response.status(500).json({
        status: 500,
        message: 'Erreur lors de la récupération des informations'
      })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['id', 'name', 'ville_id'])
      const secteur = await Secteur.find(data.id)

      if (!secteur) {
        session.flash('error', 'Secteur non trouvé')
        return response.redirect().back()
      }

      const existingSecteur = await Secteur.query()
        .where('name', data.name)
        .whereNot('id', data.id)
        .first()

      if (existingSecteur) {
        session.flash('error', 'Un secteur avec ce nom existe déjà')
        return response.redirect().back()
      }

      secteur.name = data.name
      secteur.ville_id = data.ville_id
      await secteur.save()

      session.flash('success', 'Secteur modifié avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la modification')
      return response.redirect().back()
    }
  }

  /**
   * Delete record
   */
  async destroy({ request, response, session }: HttpContext) {
    try {
      const id = request.input('deleteSecteur')
      const secteur = await Secteur.find(id)

      if (!secteur) {
        session.flash('error', 'Secteur non trouvé')
        return response.redirect().back()
      }

      await secteur.delete()
      
      session.flash('success', 'Secteur supprimé avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}