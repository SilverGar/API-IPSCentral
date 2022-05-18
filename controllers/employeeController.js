//import express from 'express'
const { sql, poolPromise } = require('../database/db')

class MainController{
    async getUserTeam(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('email', sql.VarChar, req.params.email)
            .query("EXECUTE Employee_GetTeam @email")
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async getEmployeeEditing(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('email', sql.VarChar, req.params.email)
            .query("EXECUTE getEmployeeEditing @email")
            res.json(result.recordset[0].AllowEditing)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async postEmployeeTeam360(req, res){
        try{
            
            for(var i in req.body){
                if(req.body[i].Reason != null){
                    if(req.body[i].Reason.length > 0){
                        const pool = await poolPromise
                        const result = await pool.request()
                        .input('id', sql.Int, req.body[i].TeamOwnerID)
                        .input('partnerID', sql.Int, req.body[i].PartnerID)
                        .input('check', sql.Int, req.body[i].Check1)
                        .input('reason', sql.VarChar, req.body[i].Reason)
                        .input('evalType', sql.Int, req.body[i].EvalType)
                        .input('publish', sql.Int, req.params.publish)
                        .query('EXECUTE Employee_UpdateTeam360 @id, @partnerID, @check, @reason, @evalType, @publish')
                        res.json(result.recordset)
                    }
                    else{
                        const pool = await poolPromise
                        const result = await pool.request()
                        .input('id', sql.Int, req.body[i].TeamOwnerID)
                        .input('partnerID', sql.Int, req.body[i].PartnerID)
                        .input('check', sql.Int, req.body[i].Check1)
                        .input('reason', sql.VarChar, req.body[i].reason)
                        .input('evalType', sql.Int, req.body[i].EvalType)
                        .input('publish', sql.Int, req.params.publish)
                        .query('EXECUTE Employee_UpdateTeam360 @id, @partnerID, @check, NULL, @evalType, @publish')
                        res.json(result.recordset)
                    }
                    
                }
                else{
                    console.log(req.body)
                    const pool = await poolPromise
                    const result = await pool.request()
                    .input('id', sql.Int, req.body[i].TeamOwnerID)
                    .input('partnerID', sql.Int, req.body[i].PartnerID)
                    .input('check', sql.Int, req.body[i].Check1)
                    .input('evalType', sql.Int, req.body[i].EvalType)
                    .input('publish', sql.Int, req.params.publish)
                    .query('EXECUTE Employee_UpdateTeam360 @id, @partnerID, @check, NULL, @evalType, @publish')
                    res.json(result.recordset)
                }
            }
            
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }
}

const employeeController = new MainController()
module.exports = employeeController