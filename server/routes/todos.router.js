const router = require('express').Router();
const pool = require('../modules/pool');
const pg = require('pg');

const routerPool = new pg.Pool({
    hostname: 'Christian',
    port: 5432,
    database: 'todo'
})

//GET
router.get('/', (req, res) => {
    const sqlQueryText = `
        SELECT * FROM "todos"
        ORDER BY "id";
    `

    pool.query(sqlQueryText)
        .then((dbResult) => {
            console.log('dbResult', dbResult.rows);
            res.send(dbResult.rows);
        }).catch((dbError) => {
            res.sendStatus(500);
        })
});

router.get('/:id', (req, res) => {
    console.log("req.params looks like:", req.params);
    let idOfToDo = req.params.id;
    const sqlText = `
        SELECT * FROM "todos"
            WHERE "id" = $1;
    `
    const sqlValues = [idOfToDo];
    pool.query(sqlText, sqlValues)
        .then((dbResult) => {
            let sendBackToDo = dbResult.rows[0];
            res.send(sendBackToDo);
        }).catch((dbError) => {
            console.log('Error, silly:', dbError);
            res.sendStatus(500);
        })
});

//POST
router.post('/', (req, res) => {
    console.log('POST /todos already got a request, here is req.body:', req.body);

    const sqlQueryText = `
        INSERT INTO "todos"
        ("text", "isComplete")
        VALUES 
        ($1, $2);
    `
    console.log(req.body.isComplete);
    const sqlValues = [req.body.text, req.body.isComplete];
    console.log(sqlValues, "are the values");
    pool.query(sqlQueryText, sqlValues)
        .then((dbResult) => {
            res.sendStatus(201);
            console.log('POST successful');
        }).catch((dbError) => {
            res.sendStatus(500);
        })
});

// PUT
router.put('/:id', (req, res) => {
    console.log('Does this work?');
    let toDoId = req.params.id;
    console.log(toDoId);
    const sqlQueryText = `
        UPDATE "todos"
        SET "isComplete" = NOT "isComplete"
        WHERE "id" = ($1);
    `

    const sqlValues = [toDoId];

    pool.query(sqlQueryText, sqlValues)
        .then((dbResult) => {
            res.sendStatus(201);
            console.log('PUT successful');
        }).catch((dbError) => {
            console.log('FAILURE', dbError);
            res.sendStatus(500)
        })
});

// DELETE 
router.delete('/:id', (req, res) => {
    const sqlQueryText =
    `
        DELETE FROM "todos"
            WHERE "id" = $1;
    `

    const sqlValues = [req.params.id];
    pool.query(sqlQueryText, sqlValues)
        .then((dbResult) => {
            res.sendStatus(200)
        })
        .catch((dbError) => {
            console.log('DELETE /totos/:id failed', dbError);
            res.sendStatus(500);
        })
})

module.exports = router;
