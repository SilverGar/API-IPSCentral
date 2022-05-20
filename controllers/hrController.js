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

    async hr_getConflictData(req, res){
        try{
            console.log(req.body)
            const pool = await poolPromise
            const result = await pool.request()
            .input('owner', sql.Int, req.body.owner)
            .input('partner', sql.Int, req.body.partner)
            .input('evalTypeOwner', sql.Int, req.body.evalTypeOwner)
            .input('evalTypePartner', sql.Int, req.body.evalTypePartner)
            .query("EXECUTE getConflictData @owner, @partner, @evalTypeOwner, @evalTypePartner")
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }
}

const hrController = new MainController()
module.exports = hrController