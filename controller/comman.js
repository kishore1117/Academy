const pool = require('../db');


exports.search = async (req,res)=>{
    try{
        const { table, search } = req.query;

        if (!table || !search) {
            return res.status(400).json({ error: 'Table name and search criteria are required.' });
        }
        const query = `
        SELECT * 
        FROM ${table}
        WHERE "name" ILIKE $1`; 

    const result = await pool.query(query, [`%${search}%`]); 
    res.status(200).json(result.rows);
    }
    catch{
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.filter = async (req,res)=>{
    try{
        const { table, column,value } = req.query;
        if (!table || !column) {
            return res.status(400).json({ error: 'Table name and search criteria are required.' });
        }
        const query = `
        SELECT * 
        FROM ${table}
        WHERE  ${column} = $1`; 

    const result = await pool.query(query, [value]); 
    res.status(200).json(result.rows);

    res.status(200).json(result.rows);
    }
    catch{
        res.status(500).json({ message: 'Internal server error' });
    }
}

