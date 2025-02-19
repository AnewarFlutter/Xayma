import type { HttpContext } from '@adonisjs/core/http'
import Vertuste from '#models/vertuste'
import Coefficient from '#models/coefficient'
import Mention from '#models/mention'

export default class VertustesController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    const coefficients = await Coefficient.all()
    const mentions = await Mention.all()
    return view.render('admin/vertustes/view_vertustes', { coefficients, mentions })
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    const vertustes = await Vertuste.query()
      .preload('coefficient')
      .preload('mention')
      .exec()
       
    const vertustesWithRelations = vertustes.map((vertuste) => {
      return {
        id: vertuste.id,
        coefficient_name: vertuste.coefficient.value, 
        mention_name: vertuste.mention.name,
        coefficient_id: vertuste.coefficient_id,
        mention_id: vertuste.mention_id
      }
    })

    return response.json(vertustesWithRelations)
  }

  /**
   * Handle form submission for the create action
   */
  async store({request, response, session}: HttpContext) {
    try {
      const data = request.only(['coefficient_id', 'mention_id'])

      const existingVertuste = await Vertuste.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .first()

      if (existingVertuste) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      await Vertuste.create(data)
      
      session.flash('success', 'Vétusté ajoutée avec succès')
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
  async edit({params, response}: HttpContext) {
    try {
      const vertuste = await Vertuste.find(params.id)
      
      if (!vertuste) {
        return response.status(404).json({
          status: 404,
          message: 'Vétusté non trouvée'
        })
      }

      return response.json({
        status: 200,
        vertuste: vertuste
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
  async update({request, response, session}: HttpContext) {
    try {
      const data = request.only(['id', 'coefficient_id', 'mention_id'])
      const vertuste = await Vertuste.find(data.id)

      if (!vertuste) {
        session.flash('error', 'Vétusté non trouvée')
        return response.redirect().back()
      }

      const existingVertuste = await Vertuste.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .whereNot('id', data.id)
        .first()

      if (existingVertuste) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      vertuste.coefficient_id = data.coefficient_id
      vertuste.mention_id = data.mention_id
      await vertuste.save()

      session.flash('success', 'Vétusté modifiée avec succès')
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
  async destroy({request, response, session}: HttpContext) {
    try {
      const id = request.input('deleteVertuste')
      const vertuste = await Vertuste.find(id)

      if (!vertuste) {
        session.flash('error', 'Vétusté non trouvée')
        return response.redirect().back()
      }

      await vertuste.delete()
      
      session.flash('success', 'Vétusté supprimée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}