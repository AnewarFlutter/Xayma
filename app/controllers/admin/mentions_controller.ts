import type { HttpContext } from '@adonisjs/core/http'
import Mention from '#models/mention'
import Anciennete from '#models/anciennete'
import Eclairage from '#models/eclairage'
import Ventilation from '#models/ventilation'
import Vertuste from '#models/vertuste'

export default class MentionsController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    return view.render('admin/mentions/view_mentions')
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    try {
      const mentions = await Mention.all()
      return response.json(mentions)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 500,
        message: 'Erreur lors de la récupération des mentions'
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({request, response, session}: HttpContext) {
    try {
      const data = request.only(['name'])

      // Vérifier si une mention avec le même nom existe déjà 
      const existingMention = await Mention.findBy('name', data.name)
      if (existingMention) {
        session.flash('error', 'Une mention avec ce nom existe déjà')
        return response.redirect().back()
      }

      await Mention.create(data)

      session.flash('success', 'Mention ajoutée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de l\'ajout de la mention')
      return response.redirect().back()
    }
  }

  /**
   * Edit individual record
   */
  async edit({params, response}: HttpContext) {
    try {
      const mention = await Mention.find(params.id)
      
      if (!mention) {
        return response.status(404).json({
          status: 404,
          message: 'Mention non trouvée'
        })
      }

      return response.json({
        status: 200,
        mention: mention
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
      const data = request.only(['id', 'name'])
      const mention = await Mention.find(data.id)

      if (!mention) {
        session.flash('error', 'Mention non trouvée')
        return response.redirect().back()
      }

      // Vérifier si le nom existe déjà
      const existingMention = await Mention.query()
        .where('name', data.name)
        .whereNot('id', data.id)
        .first()

      if (existingMention) {
        session.flash('error', 'Ce nom existe déjà')
        return response.redirect().back()
      }

      mention.name = data.name
      await mention.save()

      session.flash('success', 'Mention modifiée avec succès')
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
      const id = request.input('deleteMention')
      const mention = await Mention.find(id)

      if (!mention) {
        session.flash('error', 'Mention non trouvée')
        return response.redirect().back()
      }

      // Supprimer d'abord les enregistrements liés dans les autres tables
      await Promise.all([
        Anciennete.query().where('mention_id', id).delete(),
        Eclairage.query().where('mention_id', id).delete(),
        Ventilation.query().where('mention_id', id).delete(),
        Vertuste.query().where('mention_id', id).delete()
      ])

      // Supprimer ensuite la mention
      await mention.delete()
      
      session.flash('success', 'Mention et ses dépendances supprimées avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}