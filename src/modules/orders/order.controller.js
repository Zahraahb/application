import connection from "../../../db/connectionDB.js";
//getAllOrders
export const getAllOrders = (req, res, next) => {
    const query = `SELECT 
    order_summary.order_id,
    order_summary.order_date,
    order_summary.customer_id,
       
    SUM(order_summary.item_total) AS total_money
FROM 
    (
        SELECT 
            o.id AS order_id,
            o.order_date,
            o.id AS customer_id,
            c.email,
            c.first_name,
            oi.product_id,
            p.unit_price,
            oi.quantity,
            (oi.quantity * p.unit_price) AS item_total
        FROM 
            orders o
        JOIN 
            customer c ON o.customer_id = c.id
        JOIN 
            orderItem oi ON o.id = oi.order_id
        JOIN 
            product p ON oi.product_id = p.id
    ) AS order_summary
GROUP BY 
    order_summary.order_id,
    order_summary.order_date,
    order_summary.customer_id,
    order_summary.first_name;
   `;
    connection.execute(query, (err, results) => {
    if (err) {
      return res.status(400).json({ msg: "query error", err });
    }
    res.json(results);
  })
}


//CreateOrder
export const createOrder = (req, res, next) => {
    const { customer_id} = req.params
    const {items}= req.body

    const order_date = new Date().toISOString().slice(0, 19).replace('T',' ')
    const orderQuery = `INSERT INTO orders (customer_id,order_date) VALUES ("${customer_id}","${order_date}")`;
    connection.execute(orderQuery, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "query error", err })
        }
        if (!result.affectedRows) {
          return res.status(400).json({ msg: "failed to create order!" })
        }

        const order_id = result.insertId;
        

        const orderItemsQuery = `INSERT INTO orderItem (order_id,product_id,quantity) VALUES ?`
        const orderItems = items.map(item => [order_id, item.product_id, item.quantity])

        connection.query(orderItemsQuery, [orderItems], (err, result) => {
            if (err) {
              return res.status(400).json({ msg: "query error", err })
            }
            if (!result.affectedRows) {
              return res.status(400).json({ msg: "failed to create order items!" });
            }
            return res.status(201).json({ msg: "order created successfully" })
    });  
});
}

//orderAvgValue
export const orderAvgValue = (req, res, next) => {
    const query = `SELECT AVG(order_total) AS average_order_value
FROM (
    SELECT o.id AS order_id, SUM(oi.quantity * p.unit_price) AS order_total
    FROM orders o
    JOIN orderItem oi ON o.id = oi.order_id
    JOIN product p ON oi.product_id = p.id
    GROUP BY o.id
) AS order_totals;`;
    connection.execute(query, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "query error", err })
        }
        return res.status(200).json(result[0]);
      
    })
}

//customersNoOrder
export const customersNoOrder = (req, res, next) => {
    const query = `SELECT c.id,c.first_name,c.last_name,c.email,c.phone FROM customer c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL`
    connection.execute(query, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "query error", err })
        }
        return res.status(200).json({ customers_with_no_order: result })
    })
}

//customerWithMaxItems
export const customerWithMaxItems = (req, res, next) => {
    const query = `SELECT c.id, c.email, c.first_name,c.first_name,c.phone, SUM(oi.quantity) AS total_items
FROM 
    customer c
JOIN 
    orders o ON c.id = o.customer_id
JOIN 
    orderItem oi ON o.id = oi.order_id
GROUP BY 
   c.id, c.email, c.first_name, c.first_name, c.phone
ORDER BY 
    total_items DESC
    LIMIT 1`;
    connection.execute(query, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "query error", err })
        }
        return res.status(200).json({ customer_with_max_items_number: result[0] })
    })
}

//top10CustomersMoneySpent
export const top10CustomersMoneySpent = (req, res, next) => {
    const query = `SELECT c.id, c.email, c.first_name,c.first_name,c.phone, SUM(oi.quantity*p.unit_price) AS spent_money
FROM 
    customer c
JOIN 
    orders o ON c.id = o.customer_id
JOIN 
    orderItem oi ON o.id = oi.order_id
JOIN 
  product p ON p.id= oi.product_id
GROUP BY 
   c.id, c.email, c.first_name, c.first_name, c.phone
ORDER BY 
   spent_money DESC
   LIMIT 10`;
    connection.execute(query, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "query error", err })
        }
        return res.status(200).json({top10_customers_money_spent:result})
    })
}

//customers5OrMoreOrders
export const customers5OrMoreOrders = (req, res, next) => {
    const query = `SELECT c.id, c.email, c.first_name,c.first_name,c.phone, COUNT(o.id) AS number_of_orders
FROM 
    customer c
JOIN 
    orders o ON c.id = o.customer_id

  GROUP BY  c.id, c.email, c.first_name,c.first_name,c.phone
  HAVING number_of_orders >=5`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ msg: "query error", err })
    }
    return res.status(200).json({ customers_with_5_Or_More_Orders: result })
  })
}
    
//customersPercentageMoreOneOrder

export const customersPercentageMoreOneOrder = (req, res, next) => {
    const query = `SELECT COUNT( mo.customer_id) / COUNT( c.id)* 100 AS percentage_customers_more_than_one_order
    
FROM 
    customer c
LEFT JOIN 
    (
        SELECT 
            customer_id
        FROM 
            orders
        GROUP BY 
            customer_id
        HAVING 
            COUNT(customer_id) > 1
    ) AS mo
ON 
    c.id = mo.customer_id`;
    connection.execute(query, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "query error", err });
        }
        return res.status(200).json(result[0]);
        
    })
}

//customerEarliestOrder
export const customerEarliestOrder = (req, res, next) => {
    const query = `SELECT 
    c.id AS customer_id, 
    c.email, 
    c.first_name,
    c.last_name,
    c.phone,
    o.order_date
FROM 
    customer c
JOIN 
    orders o ON c.id = o.customer_id
WHERE 
    o.order_date = (
        SELECT MAX(order_date) 
        FROM orders
    )`;

    connection.execute(query, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: "query error", err });
        }
    return res.status(200).json({ customer_With_Earliest_Order: result[0] })
    })
}

