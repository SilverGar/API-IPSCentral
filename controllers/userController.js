const { sql, poolPromise } = require('../database/db')
const csvToJson = require('csvtojson')
const csv = require('csv-parser')



class MainController{
    async getUserType(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('email', sql.VarChar, req.params.email)
            .query("EXECUTE GetUserType @email")
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async updateUserType(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .input('type', sql.Int, req.params.type)
            .input('email', sql.VarChar, req.params.email)
            .query("EXECUTE UpdateUserType @type, @email")
            res.json(result)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async createNewUser(req, res){
        try{
            console.log("Hola")
            const pool = await poolPromise
            const result = await pool.request()
            .input('id', sql.Int, req.body.id)
            .input('name', sql.VarChar, req.body.name)
            .input('projectid', sql.Int, req.body.projectid)
            .input('correo', sql.VarChar, req.body.correo)
            .input('type', sql.Int, req.body.type)
            .query("EXECUTE CreateNewUser @id, @name, @projectid, @correo, @type")
            res.json(result)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async deleteUser(req, res){
        try{
            console.log("Hola")
            const pool = await poolPromise
            const result = await pool.request()
            .input('email', sql.VarChar, req.body.email)
            .query("EXECUTE deleteUser @email")
            res.json(result)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async getUsers(req, res) {
        try {
            const pool = await poolPromise
            const result = await pool.request()
            .query("EXECUTE SU_getUsers")
            res.json(result.recordset)
        }
        catch (error) {
            res.status(500)
            res.send(error.message)
        }
    }

    async getUpdate(req, res){
        try {
            const pool = await poolPromise
            const result = await pool.request()
            .input('email', sql.VarChar, req.params.email)
            .query("EXECUTE EM_getUpdate @email")
            res.json(result.recordset[0].updateTeam)
        }
        catch(error){
            res.status(500)
            res.send(error)
        }
    }

    async receivedUpdate(req, res){
        try {
            const pool = await poolPromise
            const result = await pool.request()
            .input('email', sql.VarChar, req.params.email)
            .query("EXECUTE EM_updateUpdate @email")
            
            res.json(result.recordset)
        }
        catch(error){
            res.status(500)
            res.send(error)
        }
    }

    async getReleasedStatus(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .query("EXECUTE getReleasedStatus")
            res.json(result.recordset[0].Status)
        }
        catch(error){
            res.status(500)
            res.send(error)
        }
    }

}

const userController = new MainController()
module.exports = userController