# Movie History
___

>Movie Search

Users can search for movies using 'The Movie Database' API and the movies are displayed on the page using Bootsrap thumbnail cards. The project utilizes `Browserify, SASS, jQuery, AJAX, and JSON.`  

When pulling down code, you will see an `apiKeys.example.json` with the following code:

```
{
	"apiKeys": {
		"tmdb": {
			"apiKey": ""
		}
	}
}
```

You will need to create a new `apiKeys.json`, sans the `.example` extension, containing that code snippet and the appropriate `"apiKey"` value filled in with your API key. API keys can be generated at [The Movie Database](https://developers.themoviedb.org/4/getting-started)

##### You will need to install some packages after pulling down the code

Dependencies:
```
cd lib
npm init

npm install grunt grunt-contrib-jshint matchdep grunt-contrib-watch grunt-sass grunt-browserify jshint-stylish --save-dev

npm install jquery bootstrap --save
```
Run `grunt` by typing "grunt" while in the lib folder in the command line. This will compile the whole project down into a single `app.js` file.
