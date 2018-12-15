const express = require('express');
const swapi = require('swapi-node');
const app = express();
const port = 3000;
const baseUrl = 'https://swapi.co/api';

app.get('/people', async (req, res) => {
    try {
        let totalPeople = [];
        let people = await swapi.get(baseUrl + '/people/?page=1');
        const totalPages = Math.round(people.count / 10);

        for (let i = 1; i <= totalPages; i++) {
            people = await swapi.get(baseUrl + '/people/?page=' + i);
            totalPeople.push(people.results);
        }

        totalPeople = [].concat(...totalPeople);

        switch (req.query.sortBy) {
            case 'name':
                totalPeople.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                })
                break;
            case 'height':
                totalPeople.sort((a, b) => a.height - b.height)
                break;
            case 'mass':
                totalPeople.sort((a, b) => a.mass - b.mass)
                break;
        }

        res.status(200).json(totalPeople);
    } catch (error) {
        res.status(400).json(error);
    }

})

app.get('/planets', async (req, res) => {
    try {

        let totalPlanets = [];
        let planets = await swapi.get(baseUrl + '/planets');
        const totalPages = Math.round(planets.count / 10);

        for (let i = 1; i <= totalPages; i++) {
            planets = await swapi.get(baseUrl + '/planets/?page=' + i);
            totalPlanets.push(planets.results);
        }

        totalPlanets = [].concat(...totalPlanets);

        for (let i = 0; i < totalPlanets.length; i++) {

            if (totalPlanets[i].residents.length >= 1) {
                for (let j = 0; j < totalPlanets[i].residents.length; j++) {
                    let residentData = await swapi.get(totalPlanets[i].residents[j])
                    totalPlanets[i].residents[j] = residentData.name;
                }
            }

        }


        res.status(200).json(totalPlanets);
    } catch (error) {
        res.status(400).json(error);
    }
})


app.listen(port, function () {
    console.log("Now listening to port number:", port);
})