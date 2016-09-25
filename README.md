# feriado-scraper
Html scraper em node para obter dados de todos feriados do Brasil

O sistema busca os feriados nacionais, estaduais e municipais cadastrados no site: http://www.feriadosmunicipais.com.br/

O resultado da captação está no arquivo **output-feriados.json** : https://github.com/felipe-gdr/feriado-scraper/blob/master/output-feriados.json

Para executar uma captação, inicie o server (**node server-feriados.js**), depois utilize o browser ou o comando wget para executar um request do tipo GET ao endereço http://localhost:8081/scrape-feriados
