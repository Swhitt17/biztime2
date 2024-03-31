process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let db = require("../db");

let testCompany;
beforeEach(async ()=> {
    const result = await db.query(
        `INSERT INTO companies(code,name,description)
        VALUES ('Test', 'Tester', 'Testing')
        RETURNING *`);
        testCompany = result.row[0];
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`);
})

afterEach(async () => {
    await db.end();
})

describe("GET /companies", () => {
    test("Gets a list with one company", async () =>{
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: [testCompany]});
    })
})

describe("GET /companies/:code", () => {
    test("Gets a list with one company", async () =>{
        const res = await request(app).get(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: [testCompany]});
    })
    test("Responds with 404 for invalid code", async () =>{
        const res = await request(app).get(`/companies/abc`);
        expect(res.statusCode).toBe(404);
    })
})
describe("POST /companies", () => {
    test("Creates a single company", async () =>{
        const res = (await request(app).post('/companies')).send({code:'tst',name:'Tester2', description: 'Testing2' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({company: {id:testCompany.code,name:'Tester2', description:'Testing2'}});
    })
})

describe("PATCH /companies/:code", () => {
    test("Updates a company", async () =>{
        const res = (await request(app).patch(`/companies/${testCompany.code}`)).send({code:'tst',name:'Tester2', description: 'Test Test 123' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: {id:testCompany.code,name:'Tester2', description:'Test Test 123'}});
    })
    test("Responds with 404 for invalid code", async () =>{
        const res = (await request(app).patch(`/companies/abc`)).send({code:'tst',name:'Tester2', description: 'Test Test 123' });
        expect(res.statusCode).toBe(404);
    })

})

describe("DELETE /companies/:code", () => {
    test("Deletes a company", async () =>{
        const res = (await request(app).delete(`/companies/${testCompany.code}`))
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({msg:'DELETED' });
    })

})









