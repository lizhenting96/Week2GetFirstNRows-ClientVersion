const {Client} = require('pg')
const express = require('express')

const client = new Client({
   user: "postgres",
   password: "996111lzt@",
   host: "localhost",
   port: 5432,
   database: "SummerDR"
})
const app = express()

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

app.get("/test", async (req, res) => {
   let rows = []
   try{
      const reqTableName = req.query.tableName
      const reqFirstNRows = req.query.firstNRows
      //const reqTableName = "commits"
      //const reqFirstNRows = 1
      rows = await getFirstNRows(reqTableName, reqFirstNRows)
   }
   catch(e){
      console.error(`app get failed: ${e}`)
   }
   finally{
      res.setHeader("content-type", "application/json")
      res.send(JSON.stringify(rows))
   }
})

async function connect(){
   try{
      await client.connect()
      console.log("client connect successfully!")
   }
   catch(e){
      console.error(`client connect failed: ${e}`)
   }
}

async function getFirstNRows(tableName, n) {
   try{
      const results = await client.query(`SELECT * FROM  ${tableName} LIMIT ${n}`)
      return results.rows
   }
   catch(e){
      console.error(`Read first ${n} rows from ${tableName} failed: ${e}`)
      return []
   }
}

app.listen(8080, console.log("server is listening on port 8080"))
connect()