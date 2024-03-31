process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let db = require("../db");

let testInvoice;
beforeEach(async ()=> {
    const result = await db.query(
        `INSERT INTO invoices(comp_code,amt,paid,add_date,paid_date)
        VALUES ('Test', 300, 't','2015-05-21', '2016-01-05')
        RETURNING *`);
        testInvoice = result.row[0];
})

afterEach(async () => {
    await db.query(`DELETE FROM invoices`);
})

afterEach(async () => {
    await db.end();
})

describe("GET /invoices", () => {
    test("Gets a list with one invoice", async () =>{
        const res = await request(app).get('/invoices');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({invoices: [testInvoice]});
    })
})

describe("GET /invoices/:id", () => {
    test("Gets a list with one invoice", async () =>{
        const res = await request(app).get(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({invoices: [testInvoice]});
    })
    test("Responds with 404 for invalid id", async () =>{
        const res = await request(app).get(`/invoices/0`);
        expect(res.statusCode).toBe(404);
    })
})
describe("POST /invoices", () => {
    test("Creates a single invoice", async () =>{
        const res = (await request(app).post('/invoices')).send({comp_code:'tst',amt:250, paid: 't',add_date:'2016-06-22',paid_date:'2017-02-06' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({invoices: {id:testInvoice.id,amt:250, paid: 't',add_date:'2016-06-22',paid_date:'2017-02-06'}});
    })
})

describe("PATCH /invoices/:id", () => {
    test("Updates a invoice", async () =>{
        const res = (await request(app).patch(`/invoices/${testInvoice.id}`)).send({comp_code:'tst',amt:450, paid: 't',add_date:'2016-06-22',paid_date:'2017-02-06' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({invoices: {comp_code:'tst',amt:450, paid: 't',add_date:'2016-06-22',paid_date:'2017-02-06'} });
    })
    test("Responds with 404 for invalid id", async () =>{
        const res = (await request(app).patch(`/invoices/0`)).send({comp_code:'tst',amt:450, paid: 't',add_date:'2016-06-22',paid_date:'2017-02-06'});
        expect(res.statusCode).toBe(404);
    })

})

describe("DELETE /invoices/:id", () => {
    test("Deletes a invoice", async () =>{
        const res = (await request(app).delete(`/invoices/${testInvoice.id}`))
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({msg:'DELETED' });
    })

})









