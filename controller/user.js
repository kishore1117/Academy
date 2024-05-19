const pool = require('../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { password } = require('./testing');
require('dotenv').config();

exports.signupUser = async (req,res) =>{
     try{
        let user = req.body
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const queryString = 'SELECT * from "user" WHERE email=$1'
       pool.query(queryString,[user.email],(err,result)=>{
            if(!err){
                if(result.rows.length <= 0){
                    pool.query(`INSERT INTO "user" (name,email,phone_number,password,role) VALUES($1, $2, $3, $4,'user')`,[user.name,user.email,user.phone_number,hashedPassword], (err) => {
                        if (err) {
                        return  res.status(500).send(err.detail);
                        }
                        res.status(201).json({ message:'User created successfully'});
                      });
                }
                else{
                    return res.status(400).json({ message: "Email Already Exist." });
                }
            }else{
                return res.status(500).json(err)
            }
        }) 
    }catch(err){
            return res.status(500).json(err)
    }
}

exports.loginUser = async (req,res) =>{
try{
    let user = req.body
    const queryString = 'SELECT * from "user" WHERE email=$1'
    pool.query(queryString,[user.email],async (err,result)=>{
        if(result.rows[0]?.email === user.email){
            const decrypt_password = await bcrypt.compare(user.password,result.rows[0].password)   
            if( decrypt_password){
                const token = jwt.sign({username:result.rows[0].name,email:result.rows[0].email,number:result.rows[0].phone_number,role:result.rows[0].role}, process.env.ACCESS_TOKEN)
                res.json({token})
            }else{
                return res.status(400).json({ message: "Invalid password" });
            }
        }else{
            return res.status(400).json({ message: "Email does not existe, Please signup" });
        }        
    })
}
catch{
    return res.status(500).json(err)
}
}

exports.updateUser = async (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        let {name,phone_number,role} = req.body;
        const result = await pool.query('UPDATE "user" SET name = $1, phone_number = $2, role = $3 WHERE id = $4 RETURNING *',[name,phone_number,role,id]);
        if(result.rowCount === 0){
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record updated successfully' });
    }
    catch(err){
        return res.status(500).json(err)
    }
}

exports.getUser = async (req,res)=>{
 try{
  const queryString = 'SELECT name,email,phone_number,role FROM "user" '
  const result = await pool.query(queryString);
  res.json(result.rows);
 }catch(err){
    return res.status(500).json(err)
 }
}