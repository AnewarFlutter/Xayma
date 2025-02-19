import type { HttpContext } from '@adonisjs/core/http'
import Coefficient from '#models/coefficient'
import Mention from '#models/mention'
import Anciennete from '#models/anciennete'
import Eclairage from '#models/eclairage'
import Ventilation from '#models/ventilation'
import Vertuste from '#models/vertuste'

export default class CoeficientsController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    return view.render('admin/coefficients/view_coefficients')
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    try {
      const coefficients = await Coefficient.all()
      return response.json(coefficients)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 500,
        message: 'Erreur lors de la récupération des coefficients'
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({request, response, session}: HttpContext) {
    try {
      const data = request.only(['value'])

      // Vérifier si un coefficient avec la même valeur existe déjà
      const existingCoefficient = await Coefficient.findBy('value', data.value) 
      if (existingCoefficient) {
        session.flash('error', 'Un coefficient avec cette valeur existe déjà')
        return response.redirect().back()
      }

      await Coefficient.create(data)

      session.flash('success', 'Coefficient ajouté avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de l\'ajout du coefficient')
      return response.redirect().back()
    }
  }

  /**
   * Edit individual record 
   */
  async edit({params, response}: HttpContext) {
    try {
      const coefficient = await Coefficient.find(params.id)
      
      if (!coefficient) {
        return response.status(404).json({
          status: 404,
          message: 'Coefficient non trouvé'
        })
      }

      return response.json({
        status: 200,
        coefficient: coefficient
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
      const data = request.only(['id', 'value'])
      const coefficient = await Coefficient.find(data.id)

      if (!coefficient) {
        session.flash('error', 'Coefficient non trouvé')
        return response.redirect().back()
      }

      // Vérifier si la valeur existe déjà
      const existingCoefficient = await Coefficient.query()
        .where('value', data.value)
        .whereNot('id', data.id)
        .first()

      if (existingCoefficient) {
        session.flash('error', 'Cette valeur existe déjà')
        return response.redirect().back()
      }

      coefficient.value = data.value
      await coefficient.save()

      session.flash('success', 'Coefficient modifié avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la modification')
      return response.redirect().back() 
    }
  }

  /**
   * Delete record with cascade
   */
  async destroy({ request, response, session }: HttpContext) {
    try {
      const id = request.input('deleteCoefficient')
      const coefficient = await Coefficient.find(id)

      if (!coefficient) {
        session.flash('error', 'Coefficient non trouvé')
        return response.redirect().back()
      }

      // Supprimer d'abord les enregistrements liés dans les autres tables
      await Promise.all([
        Anciennete.query().where('coefficient_id', id).delete(),
        Eclairage.query().where('coefficient_id', id).delete(),
        Ventilation.query().where('coefficient_id', id).delete(),
        Vertuste.query().where('coefficient_id', id).delete()
      ])

      // Supprimer ensuite le coefficient
      await coefficient.delete()
      
      session.flash('success', 'Coefficient et ses dépendances supprimés avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}