const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const slugify = require("slugify");

router.get('/', async(req,res,next) => {
    try{
        const results = await db.query(`SELECT code,name FROM companies ORDER BY name`);
        return res.json({ companies: results.rows});

    }
    catch(e){
        return next(e);
    }
})

router.get('/:code', async (req,res,next) => {
    try{
        let {code} = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot find company with code of ${code}}`,404);
        }
        return res.json({company: company})
    }
    catch(e){
        return next(e);
    }
})

router.post('/',async (req,res,next) => {
    try{
        const {code,name,description} = req.body;
        let code = slugify(name, {lower:true});
        const results = await db.query(`INSERT INTO companies(code,name,type) VALUES ($1,$2,$3) RETURNING *`,[code,name,description] );
        return res.status(201).json({company: results.rows[0]});
    }
    catch(e){
        return next(e);
    }
})

router.patch('/:code', async (req,res,next) => {
    try{
        const {code} = req.params;
        const {name,description} = req.body;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING *', [name,description,code]);
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot update company with code of ${code}`,404);
        }
        return res.json({company: results.rows[0]})
    }
    catch(e){
        return next(e);
    }
})
router.delete('/:code',async (req,res,next) => {
    try{
        const {code} = req.params;
        const results = await db.query(` DELETE FROM companies WHERE code =$1 RETURNING code`,[code] );
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot delete company with code of ${code}`,404);
        }
        return res.json({status: "deleted"});

    }
    catch(e){
        return next(e);
    }
})

module.exports = router;





