const pool = require('../db')
const {validateItem} = require('../models/admin_model')
const jwt = require('jsonwebtoken');

exports.createFranchise = async (req,res)=>{
    
    try{
        let franchise = req.body
        const {error,value} = validateItem(req.body);
            if(error){
                return res.status(400).json({ error: error.details[0].message });
            }
        const queryString = 'SELECT * from "franchise" WHERE client_unique_id=$1';
        pool.query(queryString,[franchise.unique_id],(err,result)=>{
            if(!err){
                if(result.rows.length <= 0){
                    const insertQuery = `INSERT INTO  "franchise" (name,client_unique_id,active) VALUES($1,$2,'true')`
                    pool.query(insertQuery,[franchise.name,franchise.unique_id],(err)=>{
                        if(err){
                            if(err.constraint ='franchise_name_key'){
                                return res.status(400).json({ message: "Franchise name already exist." });
                            }
                            return  res.status(500).send(err);
                        }
                        res.status(201).json({ message:'Franchise created successfully'});
                    })
                }else{
                    return res.status(400).json({ message: "Franchise name or unique id already exist." });
                }
            }else{
                return res.status(500).json(err)
            }
        })
    }catch{

    }
}

exports.updateFranchise = async (req,res)=>{
    try{
        const {error,value} = validateItem(req.body);
        if(error){
            return res.status(400).json({ error: error.details[0].message });
        }
        const id = parseInt(req.params.id);
        const updates = req.body
        const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(updates);
        const query = {
            text: `
                UPDATE "franchise"
                SET ${setClause}
                WHERE id = $${Object.keys(updates).length + 1}
                RETURNING name,active,client_unique_id
            `,
            values: [...values, id]
        };
        const result = await pool.query(query);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Franchise not found' });
        }
        res.json({ message: 'Franchise updated successfully', user: result.rows[0] });
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.deleteFranchise = async (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        const queryText = 'DELETE FROM "franchise" WHERE id = $1';
        const result = await pool.query(queryText, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Franchise not found' });
        }
        res.status(200).json({ message: 'Franchise deleted successfully' });
    }catch(err){
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}

exports.createLocation = async (req,res) =>{
    try{
        const {name,phone_number,address,city,state,country,zip_code} = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        jwt.verify(token,process.env.ACCESS_TOKEN, (err, decoded) => {
            if(err) {
                return res.status(403).json({ error: 'Failed to authenticate token' });
            }
            req.franchise_id = decoded.franchise;
        });
        const query = 'SELECT * FROM "location" WHERE name = $1 and franchise_id = $2';
        pool.query(query,[name,req.franchise_id],(err,result)=>{
            if(!err){
                if(result.rows.length <= 0){
                    const franchise_id =  req.franchise_id
                    pool.query(`INSERT INTO "location" (name,phone_number,address,city,state,zip_code,country,franchise_id,active) VALUES($1, $2, $3, $4, $5, $6 ,$7 ,$8, true)`,[name,phone_number,address,city,state,zip_code,country,franchise_id],(err)=>{
                        if (err) {
                            return  res.status(500).send(err);
                            }
                            res.status(201).json({ message:'location created successfully'});    
                    })
                }else{
                    return res.status(400).json({ message: "Location with the name already Exist." });
                }
            }
            else{
                return res.status(500).json(err)
            }
        })

    }catch(err){
        return res.status(500).json(err)
    }
}


exports.updateLocation = async (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        const updates = req.body
        const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(updates);
        const query = {
            text: `
                UPDATE "location"
                SET ${setClause}
                WHERE id = $${Object.keys(updates).length + 1}
                RETURNING name,active,phone_number,address,city,state,country,zip_code,franchise_id
            `,
            values: [...values, id]
        };
        const result = await pool.query(query);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json({ message: 'location updated successfully', user: result.rows[0] });
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getLocation = async (req,res)=>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        jwt.verify(token,process.env.ACCESS_TOKEN, (err, decoded) => {
            if(err) {
                return res.status(403).json({ error: 'Failed to authenticate token' });
            }
            req.franchise_id = decoded.franchise;
        });
        const query = req.query.franchise_id;
        const queryString = `SELECT * from "location" WHERE franchise_id =$1`;
        const result = await pool.query(queryString,[query]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json({location: result.rows });
    }catch(err){
        res.status(500).json({ message: 'Internal server error'});
    }
}

exports.getLocationById = async (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const queryString = 'SELECT * from "location" WHERE id=$1';
        const result =  await pool.query(queryString,[id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json(result.rows[0] );
    }
    catch{
        res.status(500).json({ message: 'Internal server error'});
    }
}

exports.deleteLocation = async (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        const queryText = 'DELETE FROM "location" WHERE id = $1';
       const result =  await pool.query(queryText, [id]);
       if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Location not found' });
    }
        res.status(200).json({ message: 'Location deleted successfully' });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}