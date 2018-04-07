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





    // function myTweets() {
	// 	var client = new twitter({
	// 		consumer_key: process.env.TWITTER_CONSUMER_KEY,
    //         consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    //         access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    //         access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	// 	});
	// 	var twitterUsername = process.argv[3];
	// 	if(!twitterUsername){
	// 		twitterUsername = "Sugeesh_";
	// 	}
	// 	params = {screen_name: twitterUsername};
	// 	client.get("statuses/user_timeline/", params, function(error, data, response){
	// 		if (!error) {
	// 			for(var i = 0; i < data.length; i++) {
	// 				//console.log(response); // Show the full response in the terminal
	// 				var twitterResults = 
	// 				"@" + data[i].user.screen_name + ": " + 
	// 				data[i].text + "\r\n" + 
	// 				data[i].created_at + "\r\n" + 
	// 				"------------------------------ " + i + " ------------------------------" + "\r\n";
	// 				console.log(twitterResults);
	// 				log(twitterResults); // calling log function
	// 			}
	// 		}  else {
	// 			console.log("Error :"+ error);
	// 			return;
	// 		}
	// 	});





        // 
        // Spotify function, uses the Spotify module to call the Spotify api
	function spotifySong(songName) {
		
		spotify.search({ type: "track", query: songName }, function(error, data) {
			if(!error){
				for (var i = 0; i < data.tracks.length; i++) {
					var songData = data.tracks.items[i];
					console.log("Artist: " + songData.artists[0].name);
					console.log("Song: " + songData.name);
					console.log("Preview URL: " + songData.preview_url);
					console.log("Album: " + songData.album.name);
					console.log("---------------------------------");
					
					
						
						log(songData); // calling log function
					}
				}
				else {
				console.log("error occured");
				}
		});
	}


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
    
    
    



