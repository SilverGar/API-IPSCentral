const { sql, poolPromise } = require('../database/db')
const csvToJson = require('csvtojson')
const csv = require('csv-parser')
const { merge } = require('lodash')


const User = {
    User: "",
    Email: "",
    Client: "",
    Project: "",
    Leader: "",
    EvalType: -1,
    Hours: 0.0
}

const Regular_Team = {
    ID: -1,
    ProjectName: "",
    TeamMembers: []
}

const Team360 = {
    ID: -1, 
    TeamOwner: User,
    Relationships: []
}


class MainController{
    async fileProcessing(req, res){
        try{
            if(!req.files){
                console.log("Sin archivo")
                res.send({
                    status: false,
                    message: 'No File Uploaded'
                })
            }
            else{
                let file = req.files.file
                
                var csvData = file.data.toString('utf8')

                if(true){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .query("EXECUTE updateFileProgress 1")
                }
                

                csvData.split("\r\n")

                var AllTeam360 = [] 
                var teamList = []
                var AllPeople = []
                var processedData = await csvToJson({
                    noheader: true,
                    output: csv,
                    headers: ["Client", "Project", "Leader", "Email", "Person", "B1", "B2", "B3", "B4", "B5", "B6", "NB1", "NB2", "NB3", "NB4", "NB5", "NB6"]
                }).fromString(csvData).then(data => {
                    var input = []
                    var hours = 0.0
                    //==================CREATE USER==================
                    for(var i in data){
                        if(data[i].Client != '' && data[i].Person != 'Totals' && data[i].Person != 'username'){
                            var newPerson = Object.create(User)
                            newPerson.User = data[i].Person
                            newPerson.Email = data[i].Email
                            newPerson.Client = data[i].Client
                            newPerson.Project = data[i].Project
                            newPerson.Leader = data[i].Leader
                            newPerson.EvalType = -1
                            hours = 0
                            if(data[i].B1 != '-'){
                                hours = hours + parseFloat(data[i].B1)
                            }
                            if(data[i].B2 != '-'){
                                hours = hours + parseFloat(data[i].B2)
                            }
                            if(data[i].B3 != '-'){
                                hours = hours + parseFloat(data[i].B3)
                            }
                            if(data[i].B4 != '-'){
                                hours = hours + parseFloat(data[i].B4)
                            }
                            if(data[i].B5 != '-'){
                                hours = hours + parseFloat(data[i].B5)
                            }
                            if(data[i].B6 != '-'){
                                hours = hours + parseFloat(data[i].B6)
                            }
                            if(data[i].NB1 != '-'){
                                hours = hours + parseFloat(data[i].NB1)
                            }
                            if(data[i].NB2 != '-'){
                                hours = hours + parseFloat(data[i].NB2)
                            }
                            if(data[i].NB3 != '-'){
                                hours = hours + parseFloat(data[i].NB3)
                            }
                            if(data[i].NB4 != '-'){
                                hours = hours + parseFloat(data[i].NB4)
                            }
                            if(data[i].NB5 != '-'){
                                hours = hours + parseFloat(data[i].NB5)
                            }
                            if(data[i].NB6 != '-'){
                                hours = hours + parseFloat(data[i].NB6)
                            }
            
                            newPerson.Hours = hours
                            input.push(newPerson)
                        }
                    }



                    var allPeopleCSV = Object.assign([], input)
                    
                    //==================GET TEAMS====================
                    var currentTeam = input[0].Project
                    var currentID = -1
                    var teamList = []
                    var currentMembers = []
                    for(var i = 0; i < input.length; i++)
                    {
                        if(currentTeam == input[i].Project)
                        {
                            currentMembers.push(input[i])
                            if(i == (input.length - 1)){

                                currentID = currentID + 1
                                var newTeam = Object.create(Regular_Team)
                                newTeam.ID = currentID
                                newTeam.ProjectName = currentTeam
                                newTeam.TeamMembers = currentMembers
                                teamList.push(newTeam)
                                currentMembers = []
                                currentMembers.push(input[i])
                                currentTeam = input[i].Project
                            }
                        }
                        else{
                            
                            currentID = currentID + 1
                            var newTeam = Object.create(Regular_Team)
                            newTeam.ID = currentID
                            newTeam.ProjectName = currentTeam
                            newTeam.TeamMembers = currentMembers
                            teamList.push(newTeam)
                            currentMembers = []
                            currentMembers.push(input[i])
                            currentTeam = input[i].Project

                            if(i == (input.length - 1)){

                                currentID = currentID + 1
                                var newTeam = Object.create(Regular_Team)
                                newTeam.ID = currentID
                                newTeam.ProjectName = currentTeam
                                newTeam.TeamMembers = currentMembers
                                teamList.push(newTeam)
                            }
                        }
                    }

                    //console.log(teamList)

                    //==================FORM 360 TEAMS====================
                    var finishedTeams = []
                    currentID = -1
                    var currentLeader = ""
                    var isLeader = false
                    for(var i = 0; i < teamList.length; i++)
                    {
                        for(var j = 0; j < teamList[i].TeamMembers.length; j++)
                        {
                            var newData = Object.assign([], teamList[i].TeamMembers)
                            var newCompanions = Object.assign([], [])
                            currentID = currentID + 1

                            //Obtiene el lider actual.
                            currentLeader = newData[j].Leader
                            if(currentLeader == newData[j].User){
                                isLeader = true
                            }
                            else{
                                isLeader = false
                            }
                            for(var k = 0; k < newData.length; k++)
                            {
                                // 0-> PEER
                                // 1-> TEAM
                                // 2-> LEADER
                                var newCompanionsObject = Object.assign({}, newData[k])
                                if(newData[j].User != newCompanionsObject.User){
                                    if(isLeader){
                                        newCompanionsObject.EvalType =  2
                                        
                                    }
                                    else{
                                        if(currentLeader == newCompanionsObject.User){
                                            newCompanionsObject.EvalType =  1
                                        }
                                        else{
                                            newCompanionsObject.EvalType =  0
                                        }
                                    }

                                    
                                    newCompanions.push(newCompanionsObject)
                                }
                            }
                            var newTeam = Object.create(Team360)
                            newTeam.ID
                            newTeam.TeamOwner = newData[j]
                            newTeam.Relationships = newCompanions
                            finishedTeams.push(newTeam)
                        }
                    }
                   

                    //==================MERGE 360 TEAMS====================
                    var finishedTeams = Object.assign([], finishedTeams)


                    var mergedTeams = []
                    var currentUser = ""
                    var uniqueRelations = []
                    var finishedMembers = []
                    for(var i = 0; i < finishedTeams.length; i++){
                        if(finishedMembers.indexOf(finishedTeams[i].TeamOwner.Email) == -1){
                            currentUser = finishedTeams[i].TeamOwner.Email
                            finishedMembers.push(currentUser)
                            var newTeam360 = Object.create(Team360)
                            newTeam360.TeamOwner = finishedTeams[i].TeamOwner
                            uniqueRelations = Object.assign([], [])


                            for(var j = 0; j < finishedTeams.length; j++){
                                //Modifica los parametros para equipos360 desde el lider
                                if(finishedTeams[j].TeamOwner.Email == currentUser){
                                    for(var k = 0; k < finishedTeams[j].Relationships.length; k++){
                                        var newMemberObject = Object.assign({}, finishedTeams[j].Relationships[k])
                                        var newOwnerObject = Object.assign({}, finishedTeams[j].TeamOwner)
                                        //Si la persona con la que trabajo tiene MAS horas que el TeamOwner,
                                        //se ajusta a la cantidad maxima de horas del TeamOwner.
                                        //EJEMPLO
                                        // A -> Trabajo 10 Horas
                                        // B -> Trabajo 200 Horas
                                        //
                                        // ENTONCES: 
                                        // A trabajo con B 10 Horas
                                        // B trabajo con A 10 Horas
                                        if(newMemberObject.Hours > newOwnerObject.Hours){
                                            newMemberObject.Hours = newOwnerObject.Hours
                                        }
                                        uniqueRelations.push(newMemberObject)
                                    }
                                }
                            }
                            newTeam360.Relationships = Object.assign([], uniqueRelations) 
                            mergedTeams.push(newTeam360)

                        }
                    }



                    return [mergedTeams, teamList, allPeopleCSV]
                })

                if(true){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .query("EXECUTE updateFileProgress 2")
                }

                AllTeam360 = Object.assign([], processedData[0])
                teamList = Object.assign([], processedData[1])
                AllPeople = Object.assign([], processedData[2])

                // ENVIA PRIMERO TODOS LOS USUARIOS.
                for(var i in AllTeam360){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .input('user', sql.VarChar, AllTeam360[i].TeamOwner.User)
                    .input('email', sql.VarChar, AllTeam360[i].TeamOwner.Email)
                    .query("EXECUTE SU_InsertNewUser @user, @email")
                }

                if(true){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .query("EXECUTE updateFileProgress 3")
                }

                for(var i in teamList){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .input('name', sql.VarChar, teamList[i].ProjectName)
                    .input('client', sql.VarChar, teamList[i].TeamMembers[0].Client)
                    .input('leader', sql.VarChar, teamList[i].TeamMembers[0].Email)
                    .query("EXECUTE SU_InsertProject @name, @client, @leader")
                }

                if(true){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .query("EXECUTE updateFileProgress 4")
                }

                for(var i in AllPeople){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .input('email', sql.VarChar, AllPeople[i].Email)
                    .input('project', sql.VarChar, AllPeople[i].Project)
                    .input('hours', sql.Int, AllPeople[i].Hours)
                    .query("EXECUTE SU_InsertHours @email, @project, @hours")
                }

                if(true){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .query("EXECUTE updateFileProgress 5")
                }


                
                for(var i in AllTeam360){
                    for(var j in AllTeam360[i].Relationships){
                        if(AllTeam360[i].Relationships[j].Hours >= 40){
                            const pool = await poolPromise
                            const result = await pool.request()
                            .input('ownerEmail', sql.VarChar, AllTeam360[i].TeamOwner.Email)
                            .input('partnerEmail', sql.VarChar, AllTeam360[i].Relationships[j].Email)
                            .input('evalType', sql.Int, AllTeam360[i].Relationships[j].EvalType)
                            .input('proyectName', sql.VarChar, AllTeam360[i].Relationships[j].Project)
                            .query("EXECUTE SU_InsertTeam360 @ownerEmail, @partnerEmail, @evalType, @proyectName, NULL")
                        }
                        else{
                            var isApproved = 0
                            const pool = await poolPromise
                            const result = await pool.request()
                            .input('ownerEmail', sql.VarChar, AllTeam360[i].TeamOwner.Email)
                            .input('partnerEmail', sql.VarChar, AllTeam360[i].Relationships[j].Email)
                            .input('evalType', sql.Int, AllTeam360[i].Relationships[j].EvalType)
                            .input('proyectName', sql.VarChar, AllTeam360[i].Relationships[j].Project)
                            .input('approved', sql.Int, isApproved)
                            .query("EXECUTE SU_InsertTeam360 @ownerEmail, @partnerEmail, @evalType, @proyectName, @approved")
                        }

                        
                    }
                }

                if(true){
                    const pool = await poolPromise
                    const result = await pool.request()
                    .query("EXECUTE updateFileProgress 6")
                }

                res.send({
                    status: true,
                    message: 'Archivo Cargado Exitosamente'
                }) 
                
            }
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async getFileUploadProgress(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .query("SU_getFileProgress")
            res.json(result.recordset[0].Status)
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }

    async releaseData(req, res){
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .query("SU_ReleaseData")
            res.send({
                status: true,
                message: 'Archivo publicado exitosamente.'
            })
        }
        catch(error){
            res.status(500)
            res.send(error.message)
        }
    }


}

const fileController = new MainController()
module.exports = fileController