import connection from "../../../db/connectionDB.js";

//getallProducts
export const getAllProducts=(req,res,next)=>{
    const query = `SELECT * FROM product`;
    connection.execute(query, (err, result) => {
      if (err) {
        return res.status(400).json({ msg: "query error", err });
      }
      if (!result.length) {
        return res.status(400).json({ msg: "no products found!" });
      }
      return res.status(200).json(result);
    });
}
//addProduct
export const addProduct=(req,res,next)=>{
    const{praduct_name, category, unit_price} = req.body;
    connection.execute(`SELECT praduct_name from product WHERE praduct_name="${praduct_name}"`,(err,result)=>{
         if (err) {
           return res.status(400).json({ msg: "query error", err });
         }
         if (result.length) {
           return res.json({ msg: "product already exists!" });
         }
         //addProduct
          const query = `INSERT INTO product (praduct_name,category,unit_price) VALUES ("${praduct_name}","${category}","${unit_price}")`;
          connection.execute(query, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: "query error", err });
            }
            if (!result.affectedRows) {
              return res.status(400).json({ msg: "failed to add product!" });
            }
            return res.status(201).json({ msg: "product added successfully" });
          });
    })
    
}

//category totalRevenue
export const categoryTotalRevenue=(req,res,next)=>{

    const query = `SELECT p.category, SUM(oi.quantity * p.unit_price) AS total_revenue FROM orderItem oi RIGHT JOIN product p ON oi.product_id = p.id GROUP BY p.category`;
    connection.execute(query, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "query error", err });
        }
        return res.status(200).json(result);
      });
    }

    //numberOfSoldItems
    export const numberOfSoldItems=(req,res,next)=>{

        const query = `SELECT p.praduct_name,p.id, SUM(oi.quantity) AS total_sold FROM orderItem oi INNER JOIN product p ON oi.product_id = p.id GROUP BY p.id`;
        connection.execute(query, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: "query error", err });
            }
            return res.status(200).json(result);
          });
        }
        


