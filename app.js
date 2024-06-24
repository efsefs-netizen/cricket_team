const express = require('express')
const app = express()

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

app.use(express.json())

const path = require('path')
dbpath = path.join(__dirname, 'cricketTeam.db')

db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000')
    })
  } catch (e) {
    console.log(e.message)
  }
}

initializeDBAndServer()

//API 1
app.get('/players/', async (request, response) => {
  const getPlayerListQuery = `
    SELECT * FROM cricket_team 
    order by player_id;`
  const playerList = await db.all(getPlayerListQuery)
  response.send(playerList)
})

//API 2
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const addPlayerQuery = `
    INSERT INTO 
    cricket_team(playerName,jerseyNumber,role)
    VALUES('${playerName}','${jerseyNumber}','${role}');`

  await db.run(getPlayerListQuery)
  response.send('Player Added to Team')
})

//API 3
app.get('/players/:playerId', async (request, response) => {
  const playerId = request.params
  const getPlayerQuery = `
    SELECT * FROM cricket_team
    WHERE playerId = ${playerId};`
  const playerList = await db.all(getPlayerQuery)
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

//API 4
app.put('/players/:playerId', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const updatePlayerQuery = `
    UPDATE cricket_team SET 
    playerName = ${playerName},
    jerseyNumber = ${jerseyNumber},
    role = ${role}`

  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

//API 5
app.delete('/players/:playerId', async (request, response) => {
  const playerId = request.params
  const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE playerId = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})
