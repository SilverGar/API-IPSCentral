const express = require('express');
const { route } = require('express/lib/application');
const controllerEmployee = require('../controllers/employeeController')
const controllerUser = require('../controllers/userController')
const controllerFile = require('../controllers/fileController')
const controllerHr = require('../controllers/hrController');
const userController = require('../controllers/userController');

const router = express.Router();


//<--------RUTAS GENERALES--------------->
router.get('/api/user_getTeam/:email', controllerEmployee.getUserTeam)
router.get('/api/getAppUpdate/:email', userController.getUpdate)
router.get('/api/getAppReceivedUpdate/:email', userController.receivedUpdate)
router.get('/api/getReleasedStatus', userController.getReleasedStatus)
router.get('/api/general/dashboardStatistic', userController.DashboardData)
router.get('/api/user/getID/:email', controllerUser.getUserID)

//<--------RUTAS PARA EMPLEADOS---------->
router.get('/api/getEmployeeEditing/:email', controllerEmployee.getEmployeeEditing)
router.post('/api/postEmployeeTeam360/:publish', controllerEmployee.postEmployeeTeam360)

//<--------RUTAS PARA SUPERUSUARIO------->
router.post('/api/processFile', controllerFile.fileProcessing)
router.get('/api/user_getUsers', controllerUser.getUsers)
router.get('/api/getUploadProgress', controllerFile.getFileUploadProgress)
router.get('/api/releaseData', controllerFile.releaseData)
router.delete('/api/su/deleteDatabase', controllerFile.resetData)
router.post('/api/su/addUser', controllerUser.addUser)
router.post('/api/su/updateUser', controllerUser.changeUserType)


//<--------RUTAS PARA RECURSOS HUMANOS--->
router.get('/api/hr/getUsers', controllerHr.hr_getEmployees)
router.get('/api/hr/getCompleteTeam/:email', controllerHr.hr_getEmployeeTeam)
router.post('/api/hr/getConflictData', controllerHr.hr_getConflictData)
router.post('/api/hr/confirmTeam', controllerHr.hr_confirmTeam)
router.get('/api/hr/getNotificationsDays/:user', controllerHr.HR_GetNotificationsDays)
router.get('/api/hr/getNotifications/:day/:user', controllerHr.hr_getNotifications)



router.get('/api/user_getType/:email', controllerUser.getUserType)
router.put('/api/updateUserType/:type/:email', controllerUser.updateUserType)

module.exports = router;