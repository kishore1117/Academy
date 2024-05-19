const pool = require('../db')
const bcrypt = require('bcrypt');

exports.createNote = async(req, res) => {
    try {
        const { name,email,password } = req.body;
        this.password = bcrypt.hash(password,8)
        const newNote = await pool.query("INSERT INTO Users (name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *", [name,email,this.password,'user'])
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message)
    }
}

exports.deleteOneNote = async(req, res) => {
    try {
        const {id} = req.params;
        const deleteNote = await pool.query("DELETE FROM users WHERE id = $1", [id]);
        res.json("Note has been deleted");
    } catch (err) {
        console.error(err.message)
        
    }
}