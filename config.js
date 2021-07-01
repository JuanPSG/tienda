const mongoose  = require("mongoose");

module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB || 'mongodb+srv://juan:Juanmongo98k@crud.tzlus.mongodb.net/tienda?retryWrites=true&w=majority',

  
  urlParser: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }

};