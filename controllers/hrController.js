//import express from 'express'
const { sql, poolPromise } = require('../database/db')

class MainController{
    async hr_getEmployees(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .query("EXECUTE HR_getUsers")
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async hr_getEmployeeTeam(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('email', sql.VarChar, req.params.email)
            .query("EXECUTE HR_GetTeam @email")
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async HR_GetNotificationsDays(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('user', sql.Int, req.params.user)
            .query("HR_GetNotificationsDays @user")
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async hr_getNotifications(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('day', sql.Date, req.params.day)
            .input('user', sql.Int, req.params.user)
            .query("HR_GetNotifications @day, @user")
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async hr_getConflictData(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('owner', sql.Int, req.body.owner)
            .input('partner', sql.Int, req.body.partner)
            .input('evalTypeOwner', sql.Int, req.body.evalTypeOwner)
            .input('evalTypePartner', sql.Int, req.body.evalTypePartner)
            .input('requestType', sql.Int, req.body.RequestType)
            .query("EXECUTE getConflictData @owner, @partner, @evalTypeOwner, @evalTypePartner, @requestType")
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async hr_confirmTeam(req, res){
      try{
        console.log(req.body)
        for(var i in req.body){
          
          

          if(req.body[i].PartnerCheck == null){
            req.body[i].PartnerCheck = true
          }
          if(req.body[i].OwnerCheck == null){
            req.body[i].OwnerCheck = true
          }
          //NOTIFICACIONES
          
          if(req.body[i].Notification.length > 0){
            console.log("\nNotificacion")
            // console.log(req.body[i].Notification)

            for(var j in req.body[i].Notification){
              // console.log("Owner: " + req.body[i].Notification[j].OwnerID)
              // console.log("Partner: " + req.body[i].Notification[j].PartnerID)
              // console.log("EvalType: " + req.body[i].Notification[j].EvalType)
              // console.log("RequestType: " + req.body[i].Notification[j].requestType)
              // console.log("HrResponse: " + req.body[i].Notification[j].HrResponse)


              const pool = await poolPromise
              const result = await pool.request()
              .input('sender', sql.Int, req.body[i].Notification[j].OwnerID)
              .input('addressee', sql.Int, req.body[i].Notification[j].PartnerID)
              .input('evalType', sql.Int, req.body[i].Notification[j].EvalType)
              .input('requestType', sql.Int, req.body[i].Notification[j].RequestType)
              .input('hr_response', sql.VarChar, req.body[i].Notification[j].HrResponse)
              .query("EXECUTE hr_SolveNotification @sender, @addressee, @evalType, @requestType, @hr_response")
            }
          }

          const pool = await poolPromise
          const result = await pool.request()
          .input('OwnerID', sql.Int, req.body[i].TeamOwnerID)
          .input('PartnerID', sql.Int, req.body[i].PartnerID)
          .input('EvalType', sql.Int, req.body[i].EvalType)
          .input('OwnerCheck', sql.Int, req.body[i].OwnerCheck)
          .input('PartnerCheck', sql.Int, req.body[i].PartnerCheck)
          .input('isApproved', sql.Int, req.body[i].HrDecision)
          .query("EXECUTE ApproveTeam @OwnerID, @PartnerID, @EvalType, @OwnerCheck, @PartnerCheck, @isApproved")

        }


        for(var i in req.body){
          if(req.body[i].PartnerCheck == null){
            req.body[i].PartnerCheck = true
          }
          if(req.body[i].OwnerCheck == null){
            req.body[i].OwnerCheck = true
          }

          const pool = await poolPromise
          const result = await pool.request()
          .input('OwnerID', sql.Int, req.body[i].PartnerID)
          .input('PartnerID', sql.Int, req.body[i].TeamOwnerID)
          .input('EvalType', sql.Int, req.body[i].EvalTypePartner)
          .input('OwnerCheck', sql.Int, req.body[i].OwnerCheck)
          .input('PartnerCheck', sql.Int, req.body[i].PartnerCheck)
          .input('isApproved', sql.Int, req.body[i].HrDecision)
          .query("EXECUTE ApproveTeam @OwnerID, @PartnerID, @EvalType, @PartnerCheck, @OwnerCheck, @isApproved")
        }

        res.send({
          status: true,
          message: 'Exito!.'
      })
      }
      catch(error){
        res.status(500)
        res.send(error.message)
      }
    }

    hr_newNotification

    
}

const hrController = new MainController()
module.exports = hrController