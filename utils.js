var moment = require('moment')

module.exports.directText = function(elem) {
  return elem.clone()    //clone the element
      .children() //select all the children
      .remove()   //remove all the children
      .end()  //again go back to selected element
      .text();
}

module.exports.extractFeriado = function(text) {
  const regex = /(\d{2}\/\d{2}\/\d{4}).* - (.*)/g,
        match = regex.exec(text)

  // Alguns feriados estão no formato: "Data Móvel - Nome do feriado "
  if(!match) {
    const spl = text.split(' - ')
    return {
      feriado: spl[1],
      dataFormatada: spl[0]
    }
  }

  return {
    feriado: match[2].replace(' (  )', ''),
    dataFormatada: match[1],
    data: moment(match[1], 'DD/MM/YYYY').unix()
  }

}

module.exports.sleep = function (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
