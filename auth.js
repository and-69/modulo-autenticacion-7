import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import router from './routes/routes.js'

const auth = express()
auth.use(express.json()) 
auth.use(express.static(path.join(__dirname, 'public')));
auth.use('/dashboard', router)

mongoose.connect(process.env.MONGO_CNX)
  .then(() => console.log('Connected to BD'))
  .catch(err => console.error('Error al conectar',err));
  
auth.listen(process.env.PORT, () => {
    console.log(`Listening the port ${process.env.PORT}`);
})
