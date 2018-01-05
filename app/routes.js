const request = require('request');


module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        
		  let user = req.user;
  var options_btc = {
  url: `https://api.gdax.com/products/BTC-USD/ticker`,
  headers: {
    'User-Agent': 'request'
  }
};
  var options_eth = {
  url: `https://api.gdax.com/products/ETH-USD/ticker`,
  headers: {
    'User-Agent': 'request'
  }
};

  var options_ltc = {
  url: `https://api.gdax.com/products/LTC-USD/ticker`,
  headers: {
    'User-Agent': 'request'
  }
};
  
  request(options_btc, function (err, response, body) {
	  var btc = JSON.parse(body);
	request(options_eth, function (err, response, body) {
		var eth = JSON.parse(body);
	request(options_ltc, function (err, response, body) {
		var ltc = JSON.parse(body);

			let weatherText = `Bitcoin's last trade price was ${btc.price}!`;
			res.render('profile.ejs', {
				//user: user_name, 
				user : req.user,
				btc_price: Math.round(btc.price * 100) / 100, 
				eth_price: Math.round(eth.price * 100) / 100, 
				ltc_price: Math.round(ltc.price * 100) / 100, 
				btc_diff: Math.round((btc.price-user.local.btc_value)*user.local.btc_share)*100/100, 
				eth_diff: Math.round((eth.price-user.local.eth_value)*user.local.eth_share)*100/100, 
				ltc_diff: Math.round((ltc.price-user.local.ltc_value)*user.local.ltc_share)*100/100,
				total: Math.round((btc.price-user.local.btc_value)*user.local.btc_share + (eth.price-user.local.eth_value)*user.local.eth_share + (ltc.price-user.local.ltc_value)*user.local.ltc_share)*100/100
				//table: "A", error: null
				});
			})
  });
  });
		
		
		
/* 		
		res.render('profile.ejs', {
            user : req.user
        }); */
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
		user.local.btc_share = undefined;
		user.local.btc_value = undefined;
		
		 // delete him
		  user.remove(function(err) {
			if (err) throw err;

			console.log('User successfully deleted!');
		  });
		
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

app.post("/update", (req, res,next) => {
 var user            = req.user;
 user.local.btc_share = req.body.btc_share;
 user.local.btc_value = req.body.btc_value;
 user.local.eth_share = req.body.eth_share;
 user.local.eth_value = req.body.eth_value;
 user.local.ltc_share = req.body.ltc_share;
 user.local.ltc_value = req.body.ltc_value;
 
 user.save()
 .then(item => {
    res.render('profile.ejs', {
            user : req.user
        });
		return;
 })
 .catch(err => {
 res.status(400).send("unable to save to database");
 });
});

// =============================================================================
// REPORT =============================================================
// =============================================================================


app.post('/report', function (req, res) {
  let user = req.user;
  var options_btc = {
  url: `https://api.gdax.com/products/BTC-USD/ticker`,
  headers: {
    'User-Agent': 'request'
  }
};
  var options_eth = {
  url: `https://api.gdax.com/products/ETH-USD/ticker`,
  headers: {
    'User-Agent': 'request'
  }
};

  var options_ltc = {
  url: `https://api.gdax.com/products/LTC-USD/ticker`,
  headers: {
    'User-Agent': 'request'
  }
};
  
  request(options_btc, function (err, response, body) {
	  var btc = JSON.parse(body);
	request(options_eth, function (err, response, body) {
		var eth = JSON.parse(body);
	request(options_ltc, function (err, response, body) {
		var ltc = JSON.parse(body);

			let weatherText = `Bitcoin's last trade price was ${btc.price}!`;
			res.render('report.ejs', {
				//user: user_name, 
				btc_price: Math.round(btc.price * 100) / 100, 
				eth_price: Math.round(eth.price * 100) / 100, 
				ltc_price: Math.round(ltc.price * 100) / 100, 
				btc_diff: Math.round((btc.price-user.local.btc_value)*user.local.btc_share)*100/100, 
				eth_diff: Math.round((eth.price-user.local.eth_value)*user.local.eth_share)*100/100, 
				ltc_diff: Math.round((ltc.price-user.local.ltc_value)*user.local.ltc_share)*100/100,
				total: Math.round((btc.price-user.local.btc_value)*user.local.btc_share + (eth.price-user.local.eth_value)*user.local.eth_share + (ltc.price-user.local.ltc_value)*user.local.ltc_share)*100/100
				//table: "A", error: null
				});
			})
  });
  });
  });






};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
