require("dotenv").config();

//Grab data from keys.js
var keys = require("./keys.js");
var request = require("request");
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter(keys.twitter);
var fs = require("fs"); //reads and writes files
var liriArgument = process.argv[2];
//--------------------------------------------------------------------------
//Possible command for this liri app
switch(liriArgument) {
    case "my-tweets": myTweets(); break;
    case "spotify-song": spotifySong(); break;
    case "movie-this": movieThis(); break;
    case "do-what-it-says": doWhatItSays(); break;
    //Instructions displayed to the user
    default: console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
			"1. my-tweets 'any twitter name' " +"\r\n"+
			"2. spotify-song 'any song name' "+"\r\n"+
			"3. movie-this 'any movie name' "+"\r\n"+
			"4. do-what-it-says."+"\r\n"+
			"Be sure to put the movie or song name in quotation marks if it's more than one word.");
	};

    
    function myTweets() {
        //Display last 20 tweets
        var screenName = {screen_name: 'Sugeesh_'};
        client.get('statuses/user_timeline', screenName, function(error, tweets, response){
            if(!error){
                for(var i = 0; i<tweets.length; i++){
                    var date = tweets[i].created_at;
                    console.log("@Sugeesh_: " + tweets[i].text + " Created at: " + date.substring(0, 19));
                    console.log("----------------------------------------");

                    //adds text to log.txt file
                    fs.appendFile('log.txt', "@Sugeesh_: " + tweets[i].text + " Created at: " + date.substring(0, 19));
                    fs.appendFile('log.txt', "-----------------------------------------------");
                }
            }else{
                console.log('Error occured');
            }
        });
    }

    // Movie function, uses the Request module to call the OMDB api
	function movieThis(){
		var movie = process.argv[3];
		if(!movie){
			movie = "mr nobody";
		}
		params = movie
		request("http://www.omdbapi.com/?apikey=" + keys.omdb.apikey + "&t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var movieObject = JSON.parse(body);
				
				//console.log(movieObject); // Show the text in the terminal
				var movieResults =
				"------------------------------ begin ------------------------------" + "\r\n" +
				"Title: " + movieObject.Title+"\r\n"+
				"Year: " + movieObject.Year+"\r\n"+
				"Imdb Rating: " + movieObject.imdbRating+"\r\n"+
				"Country: " + movieObject.Country+"\r\n"+
				"Language: " + movieObject.Language+"\r\n"+
				"Plot: " + movieObject.Plot+"\r\n"+
				"Actors: " + movieObject.Actors+"\r\n"+
				"Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
				"Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" + 
				"------------------------------ fin ------------------------------" + "\r\n";
				console.log(movieResults);
				log(movieResults); // calling log function
			} else {
				console.log("Error :"+ error);
				return;
			}
		});
	};





        // Spotify function, uses the Spotify module to call the Spotify api
		function spotifyThisSong(songName) {
			var songName = process.argv[3];
			if(!songName){
				songName = "What's my age again";
			}
			params = songName;
			spotify.search({ type: "track", query: params }, function(err, data) {
				if(!err){
					var songInfo = data.tracks.items;
					for (var i = 0; i < 5; i++) {
						if (songInfo[i] != undefined) {
							var spotifyResults =
							"Artist: " + songInfo[i].artists[0].name + "\r\n" +
							"Song: " + songInfo[i].name + "\r\n" +
							"Album the song is from: " + songInfo[i].album.name + "\r\n" +
							"Preview Url: " + songInfo[i].preview_url + "\r\n" + 
							"------------------------------ " + i + " ------------------------------" + "\r\n";
							console.log(spotifyResults);
							log(spotifyResults); // calling log function
						}
					}
				}	else {
					console.log("Error :"+ err);
					return;
				}
			});
		};

            function doWhatItSays() {
                fs.readFile('random.txt', "utf8", function(error, data) {
                    if (!error) {
                        doWhatItSaysResults = data.split(",");
                        spotifySong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
                    } else {
                        console.log("Error occured" + error);
                    }                   
                });
            };
            //Do what it says function to reads and writes module to access the log.txt file
            function log(logResults) {
                fs.appendFile("log.txt", logResults, (error) => {
                    if(error) {
                        throw error;
                    }
                });
            

        }
    
    
    



