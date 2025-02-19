import type { HttpContext } from '@adonisjs/core/http'
import Eclairage from '#models/eclairage'
import Coefficient from '#models/coefficient'
import Mention from '#models/mention'

export default class EclairagesController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    const coefficients = await Coefficient.all()
    const mentions = await Mention.all()
    return view.render('admin/eclairages/view_eclairages', { coefficients, mentions })
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    const eclairages = await Eclairage.query()
      .preload('coefficient')
      .preload('mention')
      .exec()
       
    const eclairagesWithRelations = eclairages.map((eclairage) => {
      return {
        id: eclairage.id,
        coefficient_name: eclairage.coefficient.value,
        mention_name: eclairage.mention.name,
        coefficient_id: eclairage.coefficient_id,
        mention_id: eclairage.mention_id
      }
    })

    return response.json(eclairagesWithRelations)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['coefficient_id', 'mention_id'])

      const existingEclairage = await Eclairage.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .first()

      if (existingEclairage) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      await Eclairage.create(data)
      session.flash('success', 'Éclairage ajouté avec succès')
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
      const eclairage = await Eclairage.find(params.id)
      
      if (!eclairage) {
        return response.status(404).json({
          status: 404,
          message: 'Éclairage non trouvé'
        })
      }

      return response.json({
        status: 200,
        eclairage: eclairage
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
      const eclairage = await Eclairage.find(data.id)

      if (!eclairage) {
        session.flash('error', 'Éclairage non trouvé')
        return response.redirect().back()
      }

      const existingEclairage = await Eclairage.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .whereNot('id', data.id)
        .first()

      if (existingEclairage) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      eclairage.coefficient_id = data.coefficient_id
      eclairage.mention_id = data.mention_id
      await eclairage.save()

      session.flash('success', 'Éclairage modifié avec succès')
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
      const id = request.input('deleteEclairage')
      const eclairage = await Eclairage.find(id)

      if (!eclairage) {
        session.flash('error', 'Éclairage non trouvé')
        return response.redirect().back()
      }

      await eclairage.delete()
      
      session.flash('success', 'Éclairage supprimé avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}