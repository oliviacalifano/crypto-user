// config/database.js
module.exports = {

    'url' : 'mongodb://'+process.env.MLAB_USERNAME+':'+process.env.MLAB_PASSWORD+'@ds237947.mlab.com:37947/crypto-user' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};