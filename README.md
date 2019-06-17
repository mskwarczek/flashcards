# Flashcards

[See it online](http://www.flashcards.mskwarczek.pl)

Flashcards - for better learning and remembering. This project is being continuously developed.
Frontend is made with React.js, backend with Express, database access with Mongoose.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## How to run it

You will need to change ./server/data/dburl-template.json to an real mongoDB connection data and change file name to dburl.json.
The same applies to ./server/data/secret_key-template.json which is used to generate cookies.
Both files are required by ./index.js.

There are two sets of flashcards avalievable at this point, but you may switch them to your own as long as they follow the same schema as original sets.

Type `npm run dev` in the project directory to run this app in development mode.


## Available Scripts

In the project directory, you can run:

### `npm dev`

Runs the app in the development mode (with use of React `npm start`, port 3000) AND simultaneously runs server on different port (5000).<br>
This is the recommended way to test this app.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## LICENSE

Flashcards is open source software licensed as MIT.