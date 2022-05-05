const express = require('express');
const { route } = require('express/lib/application');
const controllerEmployee = require('../controllers/employeeController')
const controllerUser = require('../controllers/userController')
const controllerFile = require('../controllers/fileController')
const controllerHr = require('../controllers/hrController')

const router = express.Router();


//<--------RUTAS GENERALES--------------->
router.get('/api/user_getTeam/:email', controllerEmployee.getUserTeam)

//<--------RUTAS PARA EMPLEADOS---------->
//RUTA PARA OBTENER EQUIPO 360
router.get('/api/getEmployeeEditing/:email', controllerEmployee.getEmployeeEditing)
router.post('/api/postEmployeeTeam360/:publish', controllerEmployee.postEmployeeTeam360)


//<--------RUTAS PARA SUPERUSUARIO------->
router.post('/api/processFile', controllerFile.fileProcessing)
router.get('/api/user_getUsers/', controllerUser.getUsers)


//<--------RUTAS PARA RECURSOS HUMANOS--->
router.get('/api/hr/getUsers', controllerHr.hr_getEmployeeTeam)


router.get('/api/user_getType/:email', controllerUser.getUserType)
router.put('/api/updateUserType/:type/:email', controllerUser.updateUserType)
router.post('/api/createUser', controllerUser.createNewUser)
router.delete('/api/deleteUser', controllerUser.deleteUser)

module.exports = router;