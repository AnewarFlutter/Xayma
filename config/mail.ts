import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * Configuration des paramètres par défaut pour l'envoi des emails
   */
  from: {
    address: env.get('MAIL_FROM_ADDRESS', 'noreply@direction-emploi.sn'),
    name: env.get('MAIL_FROM_NAME', 'Direction de l\'Emploi')
  },

  /**
   * Configuration des différents transporteurs de mail
   */
  mailers: { 
    smtp: transports.smtp({
      host: env.get('SMTP_HOST', 'localhost'),
      port: env.get('SMTP_PORT', '587'),
      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME', ''),
        pass: env.get('SMTP_PASSWORD', ''),
      },
      tls: {
        rejectUnauthorized: false
      }
    }),
  },
})

export default mailConfig

/**
 * Interface pour le typage des mailers
 */
declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}