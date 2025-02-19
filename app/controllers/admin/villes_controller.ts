import type { HttpContext } from '@adonisjs/core/http'
import Ville from '#models/ville'
import Commune from '#models/commune'

export default class VillesController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    var communes = await Commune.all()
    return view.render('admin/villes/view_villes', { communes: communes })
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    const villes = await Ville.query()
      .preload('commune')
      .exec()
       
    const villesWithCommune = villes.map((ville) => {
      return {
        id: ville.id,
        name: ville.name,
        commune_name: ville.commune.name,
        commune_id: ville.commune_id
      }
    })
 //console.log(villesWithCommune)
    return response.json(villesWithCommune)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['name', 'commune_id'])

      const existingVille = await Ville.findBy('name', data.name)
      if (existingVille) {
        session.flash('error', 'Une ville avec ce nom existe déjà')
        return response.redirect().back()
      }

      await Ville.create(data)

      session.flash('success', 'Ville ajoutée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Une erreur est survenue lors de l\'ajout de la ville')
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
      const ville = await Ville.find(params.id)
      
      if (!ville) {
        return response.status(404).json({
          status: 404,
          message: 'Ville non trouvée'
        })
      }

      return response.json({
        status: 200,
        ville: ville
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
      const data = request.only(['id', 'name', 'commune_id'])
      const ville = await Ville.find(data.id)

      if (!ville) {
        session.flash('error', 'Ville non trouvée')
        return response.redirect().back()
      }

      const existingVille = await Ville.query()
        .where('name', data.name)
        .whereNot('id', data.id)
        .first()

      if (existingVille) {
        session.flash('error', 'Une ville avec ce nom existe déjà')
        return response.redirect().back()
      }

      ville.name = data.name
      ville.commune_id = data.commune_id
      await ville.save()

      session.flash('success', 'Ville modifiée avec succès')
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
      const id = request.input('deleteVille')
      const ville = await Ville.find(id)

      if (!ville) {
        session.flash('error', 'Ville non trouvée')
        return response.redirect().back()
      }

      await ville.delete()
      
      session.flash('success', 'Ville supprimée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}