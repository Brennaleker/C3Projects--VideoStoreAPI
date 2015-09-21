"use-strict";
var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

// Here we will define our instance methods
module.exports = {
  query: function(statement, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    db.serialize(function() {
      // below: this is the callback pattern...parameters(ERRORS, RESULT)
      db.all(statement, function(err, res) {
        console.log(statement);
        console.log(err);
        // error handling looks like -> if (err) { };
        if (callback) { callback(res); }
      });
    });

    db.close();
  },

  all: function(callback) {
    this.query("SELECT * FROM " + this.table_name + ";", function(res) {
      callback(res);
    });
  },

  sort_by: function(sort_type, records_per_page, offset, callback) {
    this.query("SELECT * FROM " + this.table_name + " ORDER BY " + sort_type + " LIMIT " + records_per_page + " OFFSET " + offset + ";", function(res) {
     callback(res);
    });
  },

  movie_info: function(movie_title, callback) {
    this.query("SELECT * FROM " + this.table_name + " WHERE title LIKE '%" + movie_title + "%';", function(res) {
      callback(res);
    });
  },

  current_rentals: function(id, callback) {
    // list of current rentals out based on customer id
    this.query("SELECT * FROM rentals WHERE customer_id=" + id + " AND check_in IS NULL;", function(res) {
      callback(res);
    });
  },

  past_rentals: function(id, callback) {
    // list of past rentals based on customer id
    this.query("SELECT * FROM rentals WHERE customer_id=" + id + " AND check_in IS NOT NULL ORDER BY check_out" + ";", function(res) {
      callback(res);
    });
  },

// Get a list of customers that have currently checked out a copy of the film
  // rentals = select * from rentals where movie_title = title and check_in = null
  // select

  current_customers: function(movie_title, callback) {
    // we want customers who currently have a rental with this movie title
    this.query("SELECT customers.name FROM customers, rentals WHERE customers.id=rentals.customer_id AND rentals.movie_title LIKE '%" + movie_title + "%' AND rentals.check_in IS NULL;", function(res) {
      callback(res);
    });
  },

  // current customers with movie checkout out
  rental_info: function(movie_title, callback) {
    
  }
}

// We want to export the Database into the overall node structure
