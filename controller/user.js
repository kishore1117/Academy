const pool = require('../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user_model');
const nodemailer = require('nodemailer');
require('dotenv').config();
const {encryptData,decryptData} =  require('../service/password')

exports.signupUser = async (req, res) => {
    try {
        let user = req.body
        const errors = UserModel.validate(user);
        const hashedPassword =  await encryptData(user.password);
        const queryString = 'SELECT * from "user" WHERE email=$1'
        pool.query(queryString, [user.email], (err, result) => {
            if (!err) {
                if (errors.length > 0) {
                    return res.status(400).json({ errors });
                }
                if (result.rows.length <= 0) {
                    pool.query(`INSERT INTO "user" (name,email,phone_number,password,role) VALUES($1, $2, $3, $4,'user')`, [user.name, user.email, user.phone_number, hashedPassword], (err) => {
                        if (err) {
                            return res.status(500).send(err.detail);
                        }
                        res.status(201).json({ message: 'User created successfully' });
                    });
                }
                else {
                    return res.status(400).json({ message: "Email Already Exist." });
                }
            } else {
                return res.status(500).json(err)
            }
        })
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.loginUser = async (req, res) => {
    try {
        let user = req.body
        const queryString = 'SELECT * from "user" WHERE email=$1'
        pool.query(queryString, [user.email], async (err, result) => {
            if (result.rows[0]?.email === user.email) {
                const decrypt_password = await bcrypt.compare(user.password, result.rows[0].password)
                if (decrypt_password) {
                    console.log(result.rows[0])
                    const token = jwt.sign({ username: result.rows[0].name, email: result.rows[0].email, number: result.rows[0].phone_number, role: result.rows[0].role, franchise: result.rows[0].franchise_id }, process.env.ACCESS_TOKEN)
                    res.json({ token })
                } else {
                    return res.status(400).json({ message: "Invalid password" });
                }
            } else {
                return res.status(400).json({ message: "Email does not existe, Please signup" });
            }
        })
    }
    catch {
        return res.status(500).json(err)
    }
}

exports.updateUser = async (req, res) => {
    try {
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
                RETURNING name,email,phone_number,role,locations
            `,
            values: [...values, id]
        };
        const result = await pool.query(query);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.getUser = async (req, res) => {
    try {
        const queryString = 'SELECT name,email,phone_number,role FROM "user" '
        const result = await pool.query(queryString);
        res.json(result.rows);
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const queryText = 'DELETE FROM "user" WHERE id = $1';
        await pool.query(queryText, [id]);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}

exports.currentUser = async (req, res) => {
    try {
        const rawHeaders = req.rawHeaders;
        for (let i = 0; i < rawHeaders.length; i += 2) {
            if (rawHeaders[i].toLowerCase() === 'authorization') {
                token = rawHeaders[i + 1];
                break;
            }
        }
        value = jwt.decode(token.split(' ')[1])
        const query = {
            text: `select 
  u.id AS id,
  u.name,
  u.email,
  u.role,
  u.picture,
  u.phone_number,
  json_agg(
      json_build_object(
       'id',l.id,	
	   'name',l.name,
        'address',l.address,
	    'city',l.city,
		  'state',l.state,
		  'zip_code',l.zip_code,
		  'county',l.country
      )
  ) AS location,
   json_build_object(
        'id', f.id,
        'name', f.name
    ) AS franchise
  
 From "user" u 
  
CROSS JOIN LATERAL
    unnest(u.locations) AS l_id
JOIN
   "location" l ON l.id = l_id
   
JOIN
    "franchise" f ON u.franchise_id::int = f.id
	
WHERE u.email = $1

GROUP BY
  u.id,u.name,u.email,u.role,u.picture,u.phone_number,f.id;`,
            values: [value.email]
        }            
        const result = await pool.query(query)
        res.json(result.rows[0])
    }
    catch (err) {
        res.status(500).json({ error: 'An internal server error occurred', message: err });
    }
}

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

exports.forgotPassword = async (req, res) => {
    const user = req.body;
    query = 'SELECT email,password from "user" WHERE email=$1';
    pool.query(query, [user.email], async (err, results) => {
        const password =  await decryptData(results.rows[0].password)
      if (!err) {
        if (results.length <= 0) {
          return res
            .status(200)
            .json({ message: "Password send successfully to your email." });
        } else {
          var mailOptions = {
            from: process.env.EMAIL,
            to: results.rows[0].email,
            subject: "Password from hipeakengineers",
            html:
              "<p><b>Your Login details for Hipeakengineers system</b><br><b>Email: </b> " +
              results.rows[0].email +
              "<br><b>Password: </b>" +
             password  +
              '<br>,<a href="http://localhost:4200/">Click here to login</a></p>',
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent" + info.response);
            }
          });
          return res
            .status(200)
            .json({ message: "Password send successfully to your email." });
        }
      }
    });
}