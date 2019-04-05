require('dotenv').config();
var fs = require('fs');
var Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const axios = require('axios');
//console.log(keys);
const spotify = new Spotify(keys.spotify);
var cmd = process.argv[2];
var val = process.argv[3];
var str = '';
var apdFile = function(str){
fs.appendFile('log.txt', str, function (err) {
    if (err) throw err;
  });
  return true;
};
fs.readFile('./random.txt', function (err, data) {
    if (err) throw err;
   if(cmd == 'do-what-it-says')
   {
    var array = data.toString().split(",");
    cmd = array[0];
    val = array[1];
    //console.log(cmd, val);
   }
console.log('*************************');
apdFile('\n'+'*************************'+'\n');
if (process.argv[3] == null)
str = process.argv[0]+' '+process.argv[1]+' '+process.argv[2]+'\n';
else
str = process.argv[0]+' '+process.argv[1]+' '+process.argv[2]+' '+process.argv[3]+'\n';
apdFile(str);
switch(cmd) {
    case 'concert-this':
    {
        spotify
        .request(`https://rest.bandsintown.com/artists/${val}/events?app_id=codingbootcamp`)
        .then(function(data) {
        //console.log(JSON.stringify(data, null, 2)); 
        str = 'Name of the venue:' + data[0].venue.name + '\n' +`Venue location: ${data[0].venue.city}, ${data[0].venue.region}, ${data[0].venue.country}`+'\n';;
        console.log(str);
        apdFile(str);
        })
        .catch(function(err) {
        console.error('Error occurred: ' + err);
        apdFile(err); 
    });
           
    }
    break;
    case 'spotify-this-song':
    {
        if(val==null)
            val = "What's My Age Again";

        spotify.search({ type: 'track', query: val }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
        //console.log(JSON.stringify(data, null, 2));
        str = `Artist(s): ${data.tracks.items[0].artists[0].name}` + '\n' +
        `The song's name: ${data.tracks.items[0].name}` + '\n' + 
        `A preview link of the song from Spotify: ${data.tracks.items[0].external_urls.spotify}`+ '\n' +
        `The album that the song is from: ${data.tracks.items[0].album.name}` +'\n';
        console.log(str);
        apdFile(str);
    });
    }
    break;

    case 'movie-this':
    {
        if(val==null)
        val = "Mr. Nobody";
        
        axios.get(`http://www.omdbapi.com/?t=${val}&apikey=3e897789`).then(function(response) {
        if (response.status === 200) {
        //console.log(JSON.stringify(response.data, null, 2)); 
        str = `Title of the movie: ${response.data.Title}` + '\n' +
        `Year the movie came out: ${response.data.Year}` + '\n' +
        `IMDB Rating of the movie: ${response.data.Ratings[0].Value}` + '\n' +
        `Rotten Tomatoes Rating of the movie: ${response.data.Ratings[1].Value}` + '\n' +
        `Country where the movie was produced: ${response.data.Country}` + '\n' +
        `Language of the movie: ${response.data.Language}` + '\n' +
        `Plot of the movie: ${response.data.Plot}` + '\n' +
        `Actors in the movie: ${response.data.Actors}` +'\n';
        console.log(str);
        apdFile(str);
        }
    });
    break;
    }
}
});
