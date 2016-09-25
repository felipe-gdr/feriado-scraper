var rp = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash')
var queue = require('async').queue

var directText = require('./utils').directText
var extractFeriado = require('./utils').extractFeriado
var sleep = require('./utils').sleep

const municipais = {
  scrape: function(rootUrl) {
    const feriadosMunicipais = {}

    return rp(rootUrl).then(function (html){
      var $ = cheerio.load(html)

      $('.menuEstados').filter(function(){
        $(this).find('a').each(function() {
          const estado = $(this).text()
          feriadosMunicipais[estado] = {path: $(this).attr('href')}
        })
      })

      return feriadosMunicipais

    }).then(function() {
      // Gera uma lista de Promises, uma para cada estado
      return _.values(_.mapValues(feriadosMunicipais, function(fer) {

        return rp({url: rootUrl + fer.path, encoding: 'binary'}).then(function (html) {
          var $ = cheerio.load(html)

          $('#menuMunicipios').filter(function() {
            $(this).find('a').each(function() {
              const nomeMunicipio = $(this).text(),
                    pathMunicipio = $(this).attr('href')

              fer[nomeMunicipio] = { path:  pathMunicipio, feriados: []}
            })
          })
        })
      }))

    }).then(function(promises) {
      // Coleta todas as promises, e retorna quando todas tiverem finalizado
      return Promise.all(promises).then(values => {

        // Monta a fila
        var q = queue(function(task, callback){
          municipio = task.municipio;
          estado = task.estado

          if(municipio.path) {
            console.log('captando feriados do municipio', municipio.path)
            rp({ url: rootUrl + municipio.path, encoding: 'binary' })
              .then(function(html) {
                var $ = cheerio.load(html)
                $('#corpoFeriados').filter(function() {
                  $(this).children('ul').eq(0).find('li').each(function() {
                    _.find(feriadosMunicipais[estado], { path: municipio.path})
                      .feriados.push(extractFeriado($(this).text().trim()))
                  })
                })
                callback();
              })
          } else {
            callback();
          }
          }, 1)

          // Coloca chamada a todos os municípios na fila
        _.forIn(feriadosMunicipais, function(vEst, kEst) {
          _.forIn(vEst, function(vMun, kMun) {
            q.push({ municipio: vMun, estado: kEst }, ()=>{})
          })
        })

        return new Promise(function(resolve, reject) {
          q.drain = function() {
            resolve(feriadosMunicipais)
          }
        })

      }, reason => {
        console.log('falhou', reason)
      })
    })
  }
}

module.exports = municipais;
