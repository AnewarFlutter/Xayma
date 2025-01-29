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

  // Liste
 

}).use(middleware.auth()) // Vérifie l'authentification
.use(middleware.admin()) // Vérifie si admin










// Routes user protégées 
router.group(() => {
  // Dashboard utilisateur
  router.get('/dashboard', [DashboardController, 'index'])
    .as('dashboard.index')

  // Informations entreprise
  

})
.use(middleware.auth()) // Vérifie l'authentification
.use(middleware.user()) // Vérifie si utilisateur normal







