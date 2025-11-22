import express from 'express'
import server from 'http'
import cors from 'cors'
import { ENV } from './src/lib/env.js'
import { connectDB } from './src/lib/db.js'
import authRoutes from './src/routes/auth.routes.js'
import nodeRoutes from './src/routes/node.route.js'
import cookieParser from 'cookie-parser'

//const __dirname = path.resolve()
const PORT = ENV.PORT || 3000

const app = express()

app.use((req, res, next) => {
  console.log("GLOBAL LOG:", req.method, req.url);
  next();
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api/nodes', nodeRoutes)



app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
    connectDB();
});