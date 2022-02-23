const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema.js');
const mongoose = require('mongoose');

mongoose.connect(
  "mongodb+srv://babadany2999K:Immboold1@test.fav9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
mongoose.connection.once('open', () =>{
    console.log("Connected to db...")
})

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(5005, ()=>console.log("server is running"))