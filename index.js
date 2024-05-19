require('dotenv').config()
const express = require('express')
const router = require('./routers/route.js')

const port = process.env.PORT

const app = express()
app.use(express.json())
app.use(router)


app.listen(port,()=>{
    console.log(`server connected on http://localhost:${port}`);
})