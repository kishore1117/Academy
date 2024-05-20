const pool = require('../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user_model');
require('dotenv').config();

exports.signupUser = async (req,res) =>{
     try{
        let user = req.body
        const errors = UserModel.validate(user);
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const queryString = 'SELECT * from "user" WHERE email=$1'
       pool.query(queryString,[user.email],(err,result)=>{
            if(!err){
                if (errors.length > 0) {
                    return res.status(400).json({ errors });
                }
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
        const user = req.body
        const errors = UserModel.validate(user);
        const updates = req.body;
        const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(updates);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const query = {
            text: `
                UPDATE "user"
                SET ${setClause}
                WHERE id = $${Object.keys(updates).length + 1}
                RETURNING name,email,phone_number,role
            `,
            values: [...values, id]
        };
        const result = await pool.query(query);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user: result.rows[0] });
    }catch(err){
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Internal server error' });
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