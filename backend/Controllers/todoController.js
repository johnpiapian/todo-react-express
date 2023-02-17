const express = require('express');
const router = express.Router();
const dbService = require('../Config/database');

function getData(req, res) {
    console.log(req.user);
    dbService.getData((err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error retrieving data from database');
        }

        res.send(rows);
    });
}

module.exports = {getData}