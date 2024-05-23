import mySql from "mysql2"


const connection = mySql.createConnection(
  "mysql://unr3mrcn56orwnhm:P8tNnac1TH8Hut2nJPdT@b2bacyktanpmftogrwwm-mysql.services.clever-cloud.com:3306/b2bacyktanpmftogrwwm"
);

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected DB!");
});



export default connection;