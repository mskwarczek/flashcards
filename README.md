This small project is still being developed.

Use `npm run dev` to run both front- and back-end. Flashcards app will start automatically at localhost:3000 with server running at localhost:5000.

You will need to change ./server/data/dburl-template.json to an real mongoDB connection data and change file name to dburl.json. The same applies to ./server/data/secret_key-template.json which is used to generate cookies. Both files are required by ./index.js.