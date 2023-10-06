const cors = require('cors');

const corsOptionsGET = {
  origin: '*', 
  methods: 'GET',
  credentials: false,
  optionsSuccessStatus: 204
};

const corsOptionsPOST = {
  origin: 'https://test-xhs4.onrender.com/', // Replace with your frontend domain
  methods: 'POST',
  credentials: false,
  optionsSuccessStatus: 204
};

module.exports = {
  corsGET: cors(corsOptionsGET),
  corsPOST: cors(corsOptionsPOST)
};
