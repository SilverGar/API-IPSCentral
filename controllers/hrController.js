//import express from 'express'
const { sql, poolPromise } = require('../database/db')

class MainController{
    async hr_getEmployeeTeam(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('email', sql.VarChar, req.params.email)
            .query("EXECUTE HR_getUsers")
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