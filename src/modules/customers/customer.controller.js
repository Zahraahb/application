import connection from "../../../db/connectionDB.js";

//signup
export const signup = (req, res, next) => {
  const { first_name, last_name, email, phone } = req.body;
  connection.execute(`SELECT email from customer WHERE email="${email}"`,(err,result)=>{
    if (err) {
      return res.status(400).json({ msg: "query error", err });
    }
    if(result.length){
        return res.json({msg:"customer already exists!"})
    }
    //addCustomer
     const query = `INSERT INTO customer (first_name,last_name,email,phone) VALUES ("${first_name}","${last_name}","${email}","${phone}")`;
     connection.execute(query, (err, result) => {
       if (err) {
         return res.status(400).json({ msg: "query error", err });
       }
       if (!result.affectedRows) {
         return res.status(400).json({ msg: "failed to add customer!" });
       }
       return res.status(201).json({ msg: "customer added successfully" });
     });

  })
 
};

//login
export const login = (req, res, next) => {
  const { email, phone } = req.body;
  connection.execute(`SELECT * from customer WHERE email="${email}"`,(err,result)=>{
    if (err) {
      return res.status(400).json({ msg: "query error", err });
    }
    if(!result.length){
        return res.json({msg:"customer does not exists!"})
    }
    
    if(result[0].phone !==  phone){
        return res.json({msg:"wrong phone number!"})
    }
    return res.status(201).json({ msg: "customer logged in successfully" });
  })
};