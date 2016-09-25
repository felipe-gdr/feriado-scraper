var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var nacionais = require('./nacionais')
var estaduais = require('./estaduais')
var municipais = require('./municipais')

app.get('/scrape-feriados', function(req, res){
    console.log('------- iniciando processo ------')
    const rootUrl = 'http://www.feriadosmunicipais.com.br'

    const feriados = {nacionais: [], estaduais: [], municipais: []}

    nacionais.scrape(rootUrl)
      .then(function(data) {
        feriados.nacionais = data

        estaduais.scrape(rootUrl).then(function(data) {
          feriados.estaduais = data

          municipais.scrape(rootUrl).then(function(data) {
            feriados.municipais = data

            // Write to file
            fs.writeFile('output-feriados.json', JSON.stringify(feriados, null, 4), function(err){
                console.log('Arquivo output-feriados.json gerado, verificar o diretório do projeto');
            })

            res.send("Arquivo output-feriados.json gerado, verificar o diretório do projeto")
          })
        })
      })
})

app.listen('8081')
console.log('Navegue para http://localhost:8081/scrape-feriados para fazer acontecer');
exports = module.exports = app;
