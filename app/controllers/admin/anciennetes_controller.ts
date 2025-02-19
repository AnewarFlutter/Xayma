import type { HttpContext } from '@adonisjs/core/http'
import Anciennete from '#models/anciennete'
import Coefficient from '#models/coefficient' 
import Mention from '#models/mention'

export default class AnciennetesController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    // Récupérer les coefficients et mentions pour le formulaire
    const coefficients = await Coefficient.all()  
    const mentions = await Mention.all()
    return view.render('admin/anciennetes/view_anciennetes', { coefficients, mentions })
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    // Charger les anciennetés avec leurs relations
    const anciennetes = await Anciennete.query()
      .preload('coefficient')
      .preload('mention')
      .exec()
       
    // Transformer les données pour inclure les noms des relations
    const anciennetesWithRelations = anciennetes.map((anciennete) => {
      return {
        id: anciennete.id,
        coefficient_name: anciennete.coefficient.value,
        mention_name: anciennete.mention.name,
        coefficient_id: anciennete.coefficient_id,
        mention_id: anciennete.mention_id
      }
    })

    return response.json(anciennetesWithRelations)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['coefficient_id', 'mention_id'])

      // Vérifier si l'ancienneté existe déjà avec ces IDs
      const existingAnciennete = await Anciennete.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .first()

      if (existingAnciennete) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      await Anciennete.create(data)

      session.flash('success', 'Ancienneté ajoutée avec succès')
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
      const anciennete = await Anciennete.find(params.id)
      
      if (!anciennete) {
        return response.status(404).json({
          status: 404,
          message: 'Ancienneté non trouvée'
        })
      }

      return response.json({
        status: 200,
        anciennete: anciennete
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
      const anciennete = await Anciennete.find(data.id)

      if (!anciennete) {
        session.flash('error', 'Ancienneté non trouvée')
        return response.redirect().back()
      }

      // Vérifier si la combinaison existe déjà
      const existingAnciennete = await Anciennete.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .whereNot('id', data.id)
        .first()

      if (existingAnciennete) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      anciennete.coefficient_id = data.coefficient_id
      anciennete.mention_id = data.mention_id
      await anciennete.save()

      session.flash('success', 'Ancienneté modifiée avec succès')
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
      const id = request.input('deleteAnciennete')
      const anciennete = await Anciennete.find(id)

      if (!anciennete) {
        session.flash('error', 'Ancienneté non trouvée')
        return response.redirect().back()
      }

      await anciennete.delete()
      
      session.flash('success', 'Ancienneté supprimée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)  
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}