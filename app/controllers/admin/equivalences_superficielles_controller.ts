import type { HttpContext } from '@adonisjs/core/http'
import EquivalenceSuperficielles from '#models/equivalence_superfficielles'
import Coefficient from '#models/coefficient'
import Mention from '#models/mention'

export default class EquivalenceSuperficiellesController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const coefficients = await Coefficient.all()
    const mentions = await Mention.all()
    return view.render('admin/equivalence_superficielles/view_equivalence_superficielles', { coefficients, mentions })
  }

  /**
   * Display form to create a new record
   */
  async create({ response }: HttpContext) {
    try {
      const equivalenceSuperficielles = await EquivalenceSuperficielles.query()
        .preload('coefficient')
        .preload('mention')
        .exec()
       
      const equivalenceSuperficiellesWithRelations = equivalenceSuperficielles.map((equivalence) => {
        return {
          id: equivalence.id,
          coefficient_name: equivalence.coefficient.value, 
          mention_name: equivalence.mention.name,
          coefficient_id: equivalence.coefficient_id,
          mention_id: equivalence.mention_id
        }
      })

      return response.json(equivalenceSuperficiellesWithRelations)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 500,
        message: "Erreur lors du chargement des équivalences superficielles"
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['coefficient_id', 'mention_id'])

      // Vérifier si la combinaison existe déjà
      const existingEquivalence = await EquivalenceSuperficielles.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .first()

      if (existingEquivalence) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      await EquivalenceSuperficielles.create(data)
      
      session.flash('success', 'Équivalence superficielle ajoutée avec succès')
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
      const equivalence = await EquivalenceSuperficielles.find(params.id)
      
      if (!equivalence) {
        return response.status(404).json({
          status: 404,
          message: 'Équivalence superficielle non trouvée'
        })
      }

      return response.json({
        status: 200,
        equivalenceSuperficielle: equivalence
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
      const equivalence = await EquivalenceSuperficielles.find(data.id)

      if (!equivalence) {
        session.flash('error', 'Équivalence superficielle non trouvée')
        return response.redirect().back()
      }

      const existingEquivalence = await EquivalenceSuperficielles.query()
        .where('coefficient_id', data.coefficient_id)
        .where('mention_id', data.mention_id)
        .whereNot('id', data.id)
        .first()

      if (existingEquivalence) {
        session.flash('error', 'Cette combinaison coefficient/mention existe déjà')
        return response.redirect().back()
      }

      await equivalence.merge(data).save()

      session.flash('success', 'Équivalence superficielle modifiée avec succès')
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
      const id = request.input('deleteEquivalenceSuperficielle')
      const equivalence = await EquivalenceSuperficielles.find(id)

      if (!equivalence) {
        session.flash('error', 'Équivalence superficielle non trouvée')
        return response.redirect().back()
      }

      await equivalence.delete()
      
      session.flash('success', 'Équivalence superficielle supprimée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}