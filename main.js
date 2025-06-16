/* 
In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), 
che accetta una città come input e recupera simultaneamente:

Nome completo della città e paese da  /destinations?search=[query]
(result.name, result.country, nelle nuove proprietà city e country).

Il meteo attuale da /weathers?search={query}
(result.temperature e result.weather_description nella nuove proprietà temperature e weather).

Il nome dell’aeroporto principale da /airports?search={query}
(result.name nella nuova proprietà airport).

Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.

Note del docente
Scrivi la funzione getDashboardData(query), che deve:
Essere asincrona (async).
Utilizzare Promise.all() per eseguire più richieste in parallelo.
Restituire una Promise che risolve un oggetto contenente i dati aggregati.
Stampare i dati in console in un messaggio ben formattato.
Testa la funzione con la query "london"

🎯 Bonus 1 - Risultato vuoto
Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, 
semplicemente i dati relativi a quella chiamata verranno settati a null e  la frase relativa non viene stampata. 
Testa la funzione con la query “vienna” (non trova il meteo).
*/

const getDashboardData = async (query) => {
    // using promise all to save in an array the responses of the api
    const [destinationRes, weatherRes, airportRes] = await Promise.all([
        fetch(`http://localhost:3333/destinations?search=${query}`),
        fetch(`http://localhost:3333/weathers?search=${query}`),
        fetch(`http://localhost:3333/airports?search=${query}`),
    ])
    // parsing the responses in json using a promise all
    const [destinationData, weatherData, airportData] = await Promise.all([
        destinationRes.json(),
        weatherRes.json(),
        airportRes.json(),
    ])
    //creating object of destination weather and airport 
    const destination = destinationData[0] || {}
    const weather = weatherData[0] || {}
    const airport = airportData[0] || {}
    //creating final object with the info required
    return {
        city: destination.name,
        country: destination.country,
        temperature: weather.temperature,
        weather: weather.weather_description,
        airport: airport.name,
    }
}
//use example
getDashboardData('vienna')
    .then(data => {
        console.log('Dasboard data:', data);
        console.log(
            `${data.city} is in ${data.country}.\n` +
            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
            `The main airport is ${data.airport}.\n`
        );
    })
    .catch(error => console.error(error));