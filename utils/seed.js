"use-strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('./movies'); // requires in movies.json file
var movie_statement = db.prepare( // we will use this statement later
  "INSERT INTO MOVIES(title, overview, release_date, inventory, inventory_available) \
  VALUES( ?, ?, ?, ?, ?);"
);

var customers = require('./customers'); // requires in movies.json file
var customer_statement = db.prepare( // we will use this statement later
  "INSERT INTO CUSTOMERS(name, registered_at, address, city, state, postal_code, phone, account_credit) \
  VALUES( ?, ?, ?, ?, ?, ?, ?, ?);"
);

db.serialize(function() {
  // loop through movies
  for(var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    // insert each movie into the db
    movie_statement.run(
      movie.title,
      movie.overview,
      movie.release_date,
      movie.inventory,
      movie.inventory // this seeds our inventory_available to be equal to our total inventory
    );
  }

  // loop through customers
  for(var j = 0; j < customers.length; j++) {
    var customer = customers[j];

    // insert each customer into the db
    customer_statement.run(
      customer.name,
      customer.registered_at,
      customer.address,
      customer.city,
      customer.state,
      customer.postal_code,
      customer.phone,
      customer.account_credit
    );
  }

  movie_statement.finalize();
  customer_statement.finalize();
})

db.close();