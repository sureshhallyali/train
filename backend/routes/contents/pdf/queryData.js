const express = require('express');
const db = require('../../../db');
const { dirname } = require('path');

// Getting and adding data from sql.const db = require('../../db');

function getCarInfoData() {
    return new Promise(function(resolve, reject) {
        db.promise().query('SELECT CarModel, Company, EnginePower, Country, PriceINR FROM carInfo')
            .then(([rows, fields]) => {
                resolve(rows); // Resolve with the fetched data
            })
            .catch(error => {
                console.error('Error fetching car information ', error);
                reject(error); // Reject with the error
            });
    });
}

getCarInfoData()
    .then(function(data) {
        let rows = '';
        data.forEach(car => {
            // Adding html code for table row.
            rows += `
            <tr>
                    <td>${car.CarModel}</td>
                    <td>${car.Company}</td>
                    <td>${car.EnginePower}</td>
                    <td>${car.Country}</td>
                    <td>${car.PriceINR}</td>
            </tr>
        `;
        });
        return rows;
    })
    .catch(err => {
        console.error('Error: ', err);
        // Handle any errors
    });

module.exports = getCarInfoData ;