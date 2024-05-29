const { text } = require('express');
const pool = require('../db');


exports.createStudent = async (req,res)=>{
    try{
        let student = req.body;
        const queryString = 'SELECT * from "student" WHERE client_unique_id = $1'
        pool.query(queryString,[student.client_unique_id], async (err,result)=>{
            if(!err){
                if(result.rows.length <= 0){
                    const insertQuery = `INSERT INTO "student" (name,client_unique_id,birth_date,email,phone_number,school,kit_bag,cricket_role,student_type,location_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING name,client_unique_id,birth_date,email,phone_number,school,kit_bag,cricket_role,student_type,location_id`
                    const result =  await pool.query(insertQuery,[student.name,student.client_unique_id,student.birth_date,student.email,student.phone_number,student.school,student.kit_bag,student.cricket_role,student.student_type,student.location])
                        res.status(201).json({ message:'User created successfully', student:result.rows[0]});
                }
                else{
                    return res.status(400).json({ message: "Unique id already exist." });
                }
            }else{
                return res.status(500).json(err)
            }
        })
    }catch{
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.updateStudent = async (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        const updates = req.body;
        const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(updates);
        const query = {
            text: `
                UPDATE "student"
                SET ${setClause}
                WHERE id = $${Object.keys(updates).length + 1}
                RETURNING name,client_unique_id,birth_date,email,phone_number,school,kit_bag,cricket_role,student_type,location_id
            `,
            values: [...values, id]
        };
        const result = await pool.query(query);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully', user: result.rows[0] });
    }catch(err){
        res.status(500).json({ message: 'Internal server error',error:err });
    }
}

exports.deleteStudent =  async (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        const queryText = 'DELETE FROM "student" WHERE id = $1';
        const result = await pool.query(queryText, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    }catch(err){
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}

exports.getStudents =  async (req,res)=>{
    try{
        const id = req.query.id;
        const query = {
            text:`SELECT student.name AS student_name,student.active,student.client_unique_id,student.birth_date,student.phone_number,student.email,student.school,student.kit_bag,student.cricket_role,student.student_type,location.name AS location_name,location.address,location.city,location.state,location.franchise_id FROM student 
                  JOIN location ON student.location_id = location.id WHERE student.id = $1`,
            values:[id]
        }
        const result = await pool.query(query);
        console.log(query.text)
        res.json(result.rows);
       }catch(err){
          return res.status(500).json(err)
       } 
}

exports.getAllStudents =  async(req,res)=>{
    try{
        console.log(req.query)
        const queryString = 'SELECT student.id,student.name,student.client_unique_id,student.birth_date,student.phone_number,student.email,student.image_url,student.school,student.kit_bag,student.cricket_role,student.student_type FROM "student" WHERE student.location_id = $1' 
        const id = req.query.location_id;
        const result = await pool.query(queryString,[id]);
        res.json(result.rows);
    }catch(err){
        return res.status(500).json(err)
    }
}