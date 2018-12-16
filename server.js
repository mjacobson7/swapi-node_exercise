const express = require('express');
const swapi = require('swapi-node');
const app = express();
const port = 3000;
const baseUrl = 'https://swapi.co/api';

app.get('/people', async (req, res) => {
    try {
        let totalPeople = await getAllPeople();
        totalPeople = await sortResults(req.query.sortBy, totalPeople);
        res.status(200).json(totalPeople);
    } catch (error) {
        res.status(400).json(error);
    }
})

app.get('/planets', async (req, res) => {
    try {
        let totalPlanets = await getAllPlanets();
        totalPlanets = await Promise.all(totalPlanets.map(planet => getPlanetResidents(planet)))
        res.status(200).json(totalPlanets);
    } catch (error) {
        res.status(400).json(error);
    }
})

// Helper Functions
const getAllPeople = async () => {
    let totalPeople = [];
    let people = await swapi.get(baseUrl + '/people/?page=1');
    const totalPages = Math.round(people.count / 10);

    for (let i = 1; i <= totalPages; i++) {
        people = await swapi.get(baseUrl + '/people/?page=' + i);
        totalPeople.push(people.results);
    }
    return [].concat(...totalPeople);
}

const sortResults = (sort, totalPeople) => {
    switch (sort) {
        case 'name':
            return totalPeople.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            })
            break;
        case 'height':
            return totalPeople.sort((a, b) => a.height - b.height)
            break;
        case 'mass':
            return totalPeople.sort((a, b) => a.mass - b.mass)
            break;
        case undefined:
            return totalPeople;
            break;
    }
}

const getPlanetResidents = async (planet) => {
    if (planet.residents.length > 0) {
        let promises = planet.residents.map(async (residentUrl) => {
            let resident = await swapi.get(residentUrl);
            return resident.name;
        })
        planet.residents = await Promise.all(promises);
    }
    return planet;
}

const getAllPlanets = async () => {
    let totalPlanets = [];
    let planets = await swapi.get(baseUrl + '/planets/?page=1');
    const totalPages = Math.round(planets.count / 10);

    for (let i = 1; i <= totalPages; i++) {
        planets = await swapi.get(baseUrl + '/planets/?page=' + i);
        totalPlanets.push(planets.results);
    }
    return totalPlanets = [].concat(...totalPlanets);
}

app.listen(port, () => console.log("Now listening to port number:", port))