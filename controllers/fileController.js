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
                csvData.split("\r\n")

               
                var AllTeam360 = await csvToJson({
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

                    // for(var i in finishedTeams){
                    //     console.log("\n\nOWNER")
                    //     console.log("Nombre: " + finishedTeams[i].TeamOwner.User)
                    //     console.log("Lider: " + finishedTeams[i].TeamOwner.Leader)
                    //     console.log("MEMBERS")
                    //     for(var j in finishedTeams[i].Relationships){
                    //         console.log("Nombre: " + finishedTeams[i].Relationships[j].User)
                    //         console.log("Evaluacion: " + finishedTeams[i].Relationships[j].EvalType)
                    //     }
                    // }

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

                    // for(var i in mergedTeams){
                    //     console.log("\n\nTeamOwner")
                    //     console.log(mergedTeams[i].TeamOwner)
                    //     console.log("RELATIONSHIPS")
                    //     for(var j in mergedTeams[i].Relationships){
                    //         console.log(mergedTeams[i].Relationships[j])
                    //     }
                    // }

                    return mergedTeams
                })

                console.log(AllTeam360)

                // ENVIA PRIMERO TODOS LOS USUARIOS.
                for(var i in AllTeam360){
                    console.log("Hola")
                    const pool = await poolPromise
                    const result = await pool.request()
                    .input('user', sql.VarChar, AllTeam360[i].TeamOwner.User)
                    .input('email', sql.VarChar, AllTeam360[i].TeamOwner.Email)
                    .query("EXECUTE SU_InsertNewUser @user, @email")
                }

                //OBTIENE LOS IDs
                // const pool = await poolPromise
                // const result = await pool.request()
                // .input('user', sql.VarChar, AllTeam360[i].TeamOwner.User)
                // .input('email', sql.VarChar, AllTeam360[i].TeamOwner.Email)
                // .query("EXECUTE SU_InsertNewUser @user, @email")


                



                
                

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



}

const fileController = new MainController()
module.exports = fileController