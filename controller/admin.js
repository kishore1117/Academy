const pool = require('../db')
const {validateItem} = require('../models/admin_model')

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
                return res.status(500).json(err.detail)

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
        await pool.query(queryText, [id]);
        res.status(200).json({ message: 'Franchise deleted successfully' });
    }catch(err){
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}