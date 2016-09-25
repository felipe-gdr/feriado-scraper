var rp = require('request-promise');
var cheerio = require('cheerio');

var directText = require('./utils').directText
var extractFeriado = require('./utils').extractFeriado

const estaduais = {
  scrape: function(rootUrl) {
    const url = rootUrl + '/feriados-estaduais/';
    console.log('Scraping feriados estaduais', url)


    return rp({ url: url, encoding: 'binary' }).then(function (html){
      const $ = cheerio.load(html),
            feriadosEstaduais = {}

      $('#corpoFeriados').filter(function(){
        $(this).find('h3').each(function() {
          const estado = $(this).text().replace(/Feriados estaduais (no|em|na)/g, '')

          feriadosEstaduais[estado] = []

          $(this).next().find('li').each(function() {
            feriadosEstaduais[estado].push(extractFeriado(directText($(this))))
          })
        })
      })

      return feriadosEstaduais
    });
  }
}

module.exports = estaduais;
