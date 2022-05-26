const { sql, poolPromise } = require('../database/db')
const csvToJson = require('csvtojson')
const csv = require('csv-parser')



class MainController {
    async getUserType(req, res) {
        try {
            const pool = await poolPromise
            const result = await pool.request()
                .input('email', sql.VarChar, req.params.email)
                .query("EXECUTE GetUserType @email")
            res.json(result.recordset)
        }
        catch (error) {
            res.status(500)
            res.send(error.message)
        }
    }

    async updateUserType(req, res) {
        try {
            const pool = await poolPromise
            const result = await pool.request()
                .input('type', sql.Int, req.params.type)
                .input('email', sql.VarChar, req.params.email)
                .query("EXECUTE UpdateUserType @type, @email")
            res.json(result)
        }
        catch (error) {
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

    async getUpdate(req, res) {
        try {
            const pool = await poolPromise
            const result = await pool.request()
                .input('email', sql.VarChar, req.params.email)
                .query("EXECUTE EM_getUpdate @email")
            res.json(result.recordset[0].updateTeam)
        }
        catch (error) {
            res.status(500)
            res.send(error)
        }
    }

    async receivedUpdate(req, res) {
        try {
            const pool = await poolPromise
            const result = await pool.request()
                .input('email', sql.VarChar, req.params.email)
                .query("EXECUTE EM_updateUpdate @email")

            res.json(result.recordset)
        }
        catch (error) {
            res.status(500)
            res.send(error)
        }
    }

    async getReleasedStatus(req, res) {
        try {
            const pool = await poolPromise
            const result = await pool.request()
                .query("EXECUTE getReleasedStatus")
            res.json(result.recordset[0].Status)
        }
        catch (error) {
            res.status(500)
            res.send(error)
        }
    }

    async addUser(req, res) {
        try {
            const pool = await poolPromise
            const result = await pool.request()
                .input('name', sql.VarChar, req.body.Name)
                .input('email', sql.VarChar, req.body.Email)
                .input('ishr', sql.Int, req.body.IsHR)
                .query("EXECUTE SU_AddNewUser @name, @email, @ishr")
            res.json(result.recordset)
        } catch (error) {
            res.status(500)
            res.send(error)
        }
    }

    async changeUserType(req, res) {
        console.log(req.body);
        console.log('hola');
        try {

            for (var i in req.body) {
                const pool = await poolPromise
                const result = await pool.request()
                    .input('id', sql.Int, req.body[i].id)
                    .input('status', sql.Int, req.body[i].SU_decision)
                    .query("EXECUTE SU_UpdateUserLevel @id, @status")
                res.json(result.recordser)
            }
        } catch (error) {
            res.status(500)
            res.send(error)
        }
    }
}

const userController = new MainController()
module.exports = userController