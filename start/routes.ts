/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ContactsController from '#controllers/view/contacts_controller'
import DashboardController from '#controllers/client/dashboard_controller';



import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';
import DashboardAdminsController from '#controllers/admin/dashboard_admins_controller';
import LoginController from '#controllers/auth/login_controller';
import RegistersController from '#controllers/auth/registers_controller';
import LogoutsController from '#controllers/auth/logouts_controller';
import ProjetsController from '#controllers/client/projets_controller';
import RegionsController from '#controllers/admin/regions_controller';
import DepartementsController from '#controllers/admin/departements_controller';
import CommunesController from '#controllers/admin/communes_controller';
import VillesController from '#controllers/admin/villes_controller';
import SecteursController from '#controllers/admin/secteurs_controller';

// Routes publiques

router.get('/', [LoginController, 'index']).as('login.index')
router.get('/register', [RegistersController, 'index']).as('register.index')
router.get('/contact', [ContactsController, 'index']).as('contacts.index')

// Routes authentification
router.post('/register', [RegistersController, 'store']).as('register.store')
router.post('/login', [LoginController, 'login']).as('login.store')
router.post('/logout', [LogoutsController, 'logout']).as('logout.store')

// Routes admin protégées
router.group(() => {
  router.get('/admin/dashboard', [DashboardAdminsController, 'index'])
    .as('admin.dashboard')
  // Autres routes admin...

  // Régions
  router.get('/admin/regions', [RegionsController, 'index']).as('regions.index')
  router.get('/admin/regions/create', [RegionsController, 'create']).as('regions.create')
  router.post('/admin/regions/store', [RegionsController, 'store']).as('regions.store')
  router.get('/admin/regions/:id/edit', [RegionsController, 'edit']).as('regions.edit')
  router.post('/admin/regions/update', [RegionsController, 'update']).as('regions.update')
  router.post('/admin/regions/delete', [RegionsController, 'destroy']).as('regions.destroy')




   // Départements
   router.get('/admin/departements', [DepartementsController, 'index']).as('departements.index')
   router.get('/admin/departements/create', [DepartementsController, 'create']).as('departements.create')
   router.post('/admin/departements/store', [DepartementsController, 'store']).as('departements.store')
   router.get('/admin/departements/:id/edit', [DepartementsController, 'edit']).as('departements.edit')
   router.post('/admin/departements/update', [DepartementsController, 'update']).as('departements.update')
   router.post('/admin/departements/delete', [DepartementsController, 'destroy']).as('departements.destroy')


   //Communes

   router.get('/admin/communes', [CommunesController, 'index']).as('communes.index')
   router.get('/admin/communes/create', [CommunesController, 'create']).as('communes.create')
   router.post('/admin/communes/store', [CommunesController, 'store']).as('communes.store')
   router.get('/admin/communes/:id/edit', [CommunesController, 'edit']).as('communes.edit')
   router.post('/admin/communes/update', [CommunesController, 'update']).as('communes.update')
   router.post('/admin/communes/delete', [CommunesController, 'destroy']).as('communes.destroy')

   //Villes

   router.get('/admin/villes', [VillesController, 'index']).as('villes.index')
   router.get('/admin/villes/create', [VillesController, 'create']).as('villes.create')
   router.post('/admin/villes/store', [VillesController, 'store']).as('villes.store')
   router.get('/admin/villes/:id/edit', [VillesController, 'edit']).as('villes.edit')
   router.post('/admin/villes/update', [VillesController, 'update']).as('villes.update')
   router.post('/admin/villes/delete', [VillesController, 'destroy']).as('villes.destroy')


   //Secteurs

   router.get('/admin/secteurs', [SecteursController, 'index']).as('secteurs.index')
   router.get('/admin/secteurs/create', [SecteursController, 'create']).as('secteurs.create')
   router.post('/admin/secteurs/store', [SecteursController, 'store']).as('secteurs.store')
   router.get('/admin/secteurs/:id/edit', [SecteursController, 'edit']).as('secteurs.edit')
   router.post('/admin/secteurs/update', [SecteursController, 'update']).as('secteurs.update')
   router.post('/admin/secteurs/delete', [SecteursController, 'destroy']).as('secteurs.destroy')


 

}).use(middleware.auth()) // Vérifie l'authentification
.use(middleware.admin()) // Vérifie si admin










// Routes user protégées 
router.group(() => {
  // Dashboard utilisateur
  router.get('/dashboard', [DashboardController, 'index'])
    .as('dashboard.index')

  // Dossier

  router.get('/dossier', [ProjetsController, 'index']).as('projets.index')
  

})
.use(middleware.auth()) // Vérifie l'authentification
.use(middleware.user()) // Vérifie si utilisateur normal







