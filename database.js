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

  current_customers: function(movie_title, callback) {
    this.query("SELECT customers.id, customers.name, customers.registered_at, \
                customers.address, customers.city, customers.state, \
                customers.postal_code, customers.phone, customers.account_credit \
                FROM customers, rentals \
                WHERE customers.id=rentals.customer_id \
                AND rentals.movie_title LIKE '%" + movie_title + "%' \
                AND rentals.check_in IS NULL;", function(res) {
      callback(res);
    });
  },

  past_customers: function(movie_title, callback) {
    this.query("SELECT customers.id, customers.name, customers.registered_at, \
                customers.address, customers.city, customers.state, \
                customers.postal_code, customers.phone, customers.account_credit \
                FROM customers, rentals \
                WHERE customers.id=rentals.customer_id \
                AND rentals.movie_title LIKE '%" + movie_title + "%' \
                AND rentals.check_in IS NOT NULL;", function(res) {
      callback(res);
    });
  },

  past_customers_sort: function(movie_title, sort_type, callback) {
    this.query("SELECT customers.id, customers.name, customers.registered_at, \
                customers.address, customers.city, customers.state, \
                customers.postal_code, customers.phone, customers.account_credit \
                FROM customers, rentals \
                WHERE customers.id=rentals.customer_id \
                AND rentals.movie_title LIKE '%" + movie_title + "%' \
                AND rentals.check_in IS NOT NULL \
                ORDER BY " + sort_type + ";", function(res) {
      callback(res);
    });
  }
}

// SELECT customers.id, customers.name FROM customers, rentals WHERE customers.id=rentals.customer_id AND rentals.movie_title LIKE '%" + movie_title + "%' AND rentals.check_in IS NOT NULL ORDER BY rentals.customer_id;
