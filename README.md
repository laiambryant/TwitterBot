# TwitterBot
A simple Twitter bot that uses Twitter API, node, mogoDB and Websocket

Welcome to the TwitterBot. The objective of this twitter bot is to have some fun with the Twitter API showing how easy it can be to post massive amounts of tweets in a short period of time (as many as one per user every 12 seconds).It also implements a Chatroom for users to interact with each other.

To run the Twitter Bot on your device, you must insert your own Keys in the Services/Keys.js file and in the same file you should also insert a custom Secret.

The road map in explaining this twitter bot will be structured in the following way:

* General Information
* API
* Routes
* Services
* Views
* Postman
* Things that can be improved on (if time permits)

I hope you'll enjoy using the bot, it's not perfect but it gets the job done and gives a good understanding of how node, web socket, twitter API and RESTful services work. I worked on this project on my own so i had to use some extra middleware to help me develop it in decent time, but i'll explain how you can expand on it in the specific paragraphs you can find on the Wiki on the github page: https://github.com/laiambryant/TwitterBot. In the Postman JSON folder you also have a JSON file to import the postman tests.

# Docker instructions

### To build: (sudo if necessary)

> docker-compose up

If you build though docker you will create an image of a mongodb server to run your local instance of the server. If you want to connect to an external server you have to update the docker-compose.yml file dependencies and the dockerfile and the value of the CONNECTIONSTRING const in the app.js file

### To stop container: (sudo if necessary)

> docker-compose down

Stops and removes both the mongodb and the twitter-app images
