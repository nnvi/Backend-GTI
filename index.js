require('dotenv').config()
const express = require('express')
const router = require('./routers/route.js')

const app = express()

const port = process.env.PORT

app.use(express.json())

app.use(router)


app.listen(port,()=>{
    console.log(`server connected on http://localhost:${port}`);
})