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

🎯 Bonus 2 - Chiamate fallite
Attualmente, se una delle chiamate fallisce, **Promise.all()** rigetta l'intera operazione.

Modifica `getDashboardData()` per usare **Promise.allSettled()**, in modo che:
Se una chiamata fallisce, i dati relativi a quella chiamata verranno settati a null.
Stampa in console un messaggio di errore per ogni richiesta fallita.
Testa la funzione con un link fittizio per il meteo (es. https://www.meteofittizio.it).
*/

const getDashboardData = async (query) => {
    // using promise allsettled to save in an array the responses of the api
    const [destinationRes, weatherRes, airportRes] = await Promise.allSettled([
        fetch(`http://localhost:3333/destinations?search=${query}`),
        fetch(`https://www.meteofittizio.it?search=${query}`),
        fetch(`http://localhost:3333/airports?search=${query}`),
    ])
    // parsing the responses in json only if the status is fulfilled
    const parseData = async (res) => {
        if (res.status === 'fulfilled') {
            const data = await res.value.json();
            return data.length > 0 ? data[0] : null;
        } else {
            console.error(`Errore fetch`, res.reason);
            return null;
        }
    };
    //creating object of destination weather and airport 
    const destinationData = await parseData(destinationRes);
    const weatherData = await parseData(weatherRes);
    const airportData = await parseData(airportRes);

    //creating final object with the info required
    return {
        city: destinationData && destinationData.name ? destinationData.name : null,
        country: destinationData && destinationData.country ? destinationData.country : null,
        temperature: weatherData && weatherData.temperature ? weatherData.temperature : null,
        weather: weatherData && weatherData.weather_description ? weatherData.weather_description : null,
        airport: airportData && airportData.name ? airportData.name : null,
    };
}

//use example
getDashboardData('vienna')
    .then(data => {
        console.log('Dasboard data:', data);

        let message = ``

        if (data.city !== null && data.country !== null) {
            message += `${data.city} is in ${data.country}.\n`
        }
        if (data.temperature !== null && data.weather !== null) {
            message += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`
        }
        if (data.airport !== null) {
            message += `The main airport is ${data.airport}.\n`
        }
        console.log(message)
    })
    .catch(error => console.error(error));