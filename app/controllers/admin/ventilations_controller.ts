import type { HttpContext } from '@adonisjs/core/http'
import Ventilation from '#models/ventilation'
import Coefficient from '#models/coefficient'
import Mention from '#models/mention'

export default class VentilationsController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    const coefficients = await Coefficient.all()
    const mentions = await Mention.all()
    return view.render('admin/ventilations/view_ventilations', { coefficients, mentions })
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    // Charger les ventilations avec leurs relations
    const ventilations = await Ventilation.query()
      .preload('coefficient')
      .preload('mention')
      .exec()
       
    // Transformer les données pour inclure les noms des relations
    const ventilationsWithRelations = ventilations.map((ventilation) => {
      return {
        id: ventilation.id,
        coefficient_name: ventilation.coefficient.value,
        mention_name: ventilation.mention.name,
        coefficient_id: ventilation.coefficient_id,
        mention_id: ventilation.mention_id
      }
    })

    return response.json(ventilationsWithRelations)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['coefficient_id', 'mention_id'])

      // Vérifier si la ventilation existe déjà avec ces IDs
      const existingVentilation = await Ventilation.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .first()

      if (existingVentilation) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      await Ventilation.create(data)

      session.flash('success', 'Ventilation ajoutée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Une erreur est survenue lors de l\'ajout')
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
      const ventilation = await Ventilation.find(params.id)
      
      if (!ventilation) {
        return response.status(404).json({
          status: 404,
          message: 'Ventilation non trouvée'
        })
      }

      return response.json({
        status: 200,
        ventilation: ventilation
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
      const data = request.only(['id', 'coefficient_id', 'mention_id'])
      const ventilation = await Ventilation.find(data.id)

      if (!ventilation) {
        session.flash('error', 'Ventilation non trouvée')
        return response.redirect().back()
      }

      // Vérifier si la combinaison existe déjà
      const existingVentilation = await Ventilation.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .whereNot('id', data.id)
        .first()

      if (existingVentilation) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      ventilation.coefficient_id = data.coefficient_id
      ventilation.mention_id = data.mention_id
      await ventilation.save()

      session.flash('success', 'Ventilation modifiée avec succès')
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
      const id = request.input('deleteVentilation')
      const ventilation = await Ventilation.find(id)

      if (!ventilation) {
        session.flash('error', 'Ventilation non trouvée')
        return response.redirect().back()
      }

      await ventilation.delete()
      
      session.flash('success', 'Ventilation supprimée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}