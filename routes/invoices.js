const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");

router.get('/', async(req,res,next) => {
    try{
        const results = await db.query(`SELECT id,comp_code FROM invoices ORDER BY id`);
        return res.json({ invoices: results.rows});
    }
    catch(e){
        return next(e);
    }
})

router.get('/:id', async (req,res,next) => {
    try{
        const {id} = req.params;
        const results = await db.query(
            `SELECT i.id, 
             i.comp_code, 
             i.amt, 
             i.paid, 
             i.add_date, 
             i.paid_date, 
             c.name, 
             c.description 
             FROM invoices AS i 
             INNER JOIN companies AS c 
             ON (i.comp_code = c.code)
             WHERE id = $1`, [id]);
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot find invoice with id of ${id}`,404);
        }
        const data = result.rows[0];
        const invoice = {
            id: data.id,
            company: {
                code: data.comp_code,
                name: data.name,
                description: data.description,   
            },
            amt: data.amt,
            paid: data.paid,
            add_date: data.add_date,
            paid_date: data.paid_date,
        };

        return res.json({"invoice": invoice})
    }
    catch(e){
        return next(e);
    }
})

router.post('/',async (req,res,next) => {
    try{
        const {comp_code,amt} = req.body;
        const results = await db.query(`INSERT INTO invoices(comp_code,amt) VALUES ($1,$2) RETURNING *`,[comp_code,amt] );
        return res.status(201).json({invoice: results.rows[0]});

    }
    catch(e){
        return next(e);
    }
})

router.patch('/:id', async (req,res,next) => {
    try{
        const {id} = req.params;
        const {amt,paid} = req.body;
        let paidDate = null;
        const paidResult = await db.query(`SELECT paid FROM invoices WHERE id = $1`);
        if(paidResults.rows.length === 0) {
            throw new ExpressError(`Cannot find invoice`,404);
        }

        const paidResultDate = paidResult.rows[0].paid_date;
        if(!paidResultDate && paid){
            paidDate = new Date();
        }
        else if (!paid){
            paidDate = null;
        }
        else{
            paidDate = paidResultDate;
        }

        const results = await db.query('UPDATE invoices SET amt=$1, paid=$2, paid_date= $3 WHERE id = $4 RETURNING *', [amt,paid,paidDate,id]);
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot update invoice with id of ${id}`,404);
        }
        return res.json({invoice: results.rows[0]})
    }
    catch(e){
        return next(e);
    }
})
router.delete('/:id',async (req,res,next) => {
    try{
        const {id} = req.params;
        const results = await db.query(` DELETE FROM invoices WHERE id =$1 RETURNING id`,[id] );
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot delete invoice with id of ${id}`,404);
        }
        return res.json({status: "deleted"});

    }
    catch(e){
        return next(e);
    }
})





module.exports = router;