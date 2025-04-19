const express = require("express")
const morgan = require("morgan");
const { notFound ,errorHandler} = require("./middlewares/Error")
const cors = require("cors")
const connectToDb = require("./config/connectToDb")
// const landingController = require('./Controller/landingController');
// const listingController = require('./Controller/listingController');
require("dotenv").config()
connectToDb();


//Init App
const app = express()

//Cors Policy
app.use(cors())
// app.set('view engine', 'ejs');

//Apply Middlewares    
app.use(express.json())
app.use(morgan('dev'))

// app.use('/api/landing', landingController);
// app.use('/api/listing', listingController);
app.use("/api/auth",require("./routes/auth"))
app.use("/api/product",require("./routes/product"))
app.use("/api/password",require("./routes/password"))
app.use("/api/category",require("./routes/category"))
app.use("/api/user",require("./routes/user"))
app.use("/api/order", require("./routes/order"))
app.use("/api/review", require("./routes/review"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/checkout", require("./routes/checkOut"))



// Error Handler middlewares
app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 6000
app.listen(PORT,()=>console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`))
