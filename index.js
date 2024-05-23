import express from 'express';
import connection from './db/connectionDB.js';
import customerRouter from './src/modules/customers/customer.routes.js'
import productRouter from "./src/modules/products/product.routes.js"
import orderRouter from "./src/modules/orders/order.routes.js"



const app = express()
const port = process.env.port || 3000


connection
app.use(express.json())
app.use("/",customerRouter)
app.use("/products",productRouter)
app.use("/orders",orderRouter)


app.use("*", (req, res, next) => {
  res.json({ msg: "404 not found" });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
  
});