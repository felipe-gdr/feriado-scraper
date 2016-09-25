var rp = require('request-promise');
var cheerio = require('cheerio');

var directText = require('./utils').directText
var extractFeriado = require('./utils').extractFeriado

const nacionais = {
  scrape: function(rootUrl) {
    const url = rootUrl + '/feriados-nacionais/';
    console.log('Scraping feriados nacionais', url)


    return rp({ url: url, encoding: 'binary' }).then(function (html){
      const $ = cheerio.load(html),
            feriadosNacionais = []

      $('#corpoFeriados').filter(function(){
        $(this).find('ul>li').each(function() {
          feriadosNacionais.push(extractFeriado(directText($(this))))
        })
      })

      return feriadosNacionais
    });
  }
}

module.exports = nacionais;
