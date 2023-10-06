const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Url } = require('./db'); 
const path = require('path'); 
const favicon = require('serve-favicon');
const rateLimiterMiddleware = require('./middlewares/rate'); 
const { onlyJson } = require('./middlewares/header'); // Import the custom middleware
const url = require('url'); 
const {setSecurityHeaders} = require('./middlewares/sec')

const {checkEmptyRequestBody} = require('./middlewares/empty')

const app = express();
const { corsGET, corsPOST } = require('./middlewares/cors'); 
app.use(favicon(path.join(__dirname, 'Front', 'media', 'favicon.ico')));

const port = 6969;
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'Front', 'views'));


// GET route to retrieve all documents
//app.get('/api/urls', async (req, res) => {
  //try {
    //  const allUrls = await Url.find();
      //res.json(allUrls);
   //} catch (error) {
  //     res.status(500).json({ error: 'An error occurred while retrieving URLs' });
  // }
 //});

 const serverUrl = 'http://localhost:6969'; // Replace with your server's URL
 const intervalInMilliseconds = 14 * 60 * 1000; // 14 minutes in milliseconds
 const sleepDurationInMilliseconds = 9 * 1000; // 9 seconds in milliseconds
 
 function pingServer() {
   axios.get(serverUrl)
     .then((response) => {
       console.log('Ping successful at', new Date().toLocaleString());
       console.log('Response status:', response.status);
     })
     .catch((error) => {
       console.error('Ping error at', new Date().toLocaleString(), ':', error.message);
     });
 }
 
 // Initial ping and setup interval
 pingServer();
 
 setInterval(() => {
   pingServer();
   setTimeout(pingServer, sleepDurationInMilliseconds); // Sleep before the second ping
 }, intervalInMilliseconds);


 // no need to create other endpoint
// Render index.ejs with dynamic data is rendered in the home 
app.get('/', async (req, res) => {
  try {
    const lastTenEntries = await Url.find().sort({ _id: -1 }).limit(8);
    res.render('index', { lastTenEntries });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving URLs' });
  }

  const serverUrl = 'http://localhost:6969'; // Replace with your server's URL
  const intervalInMilliseconds = 14 * 60 * 1000; // 14 minutes in milliseconds
  
  function pingServer() {
    axios.get(serverUrl)
      .then((response) => {
        console.log('Ping successful at', new Date().toLocaleString());
        console.log('Response status:', response.status);
      })
      .catch((error) => {
        console.error('Ping error at', new Date().toLocaleString(), ':', error.message);
      });
  }
  
  
  
  setInterval(pingServer, intervalInMilliseconds);

});


// no need to create other endpoint


// app.get('/', (req, res) => {
//   try {
//     res.render('index'); // Just render the 'index.ejs' template without any data
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while rendering the template' });
//   }
// });

app.get('/api-docs', (req, res) => {
  try {
    res.render('api-docs'); // Just render the 'index.ejs' template without any data
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while rendering the template' });
  }
});



//[post]
app.post('/unshorten', rateLimiterMiddleware, corsPOST,onlyJson,setSecurityHeaders,checkEmptyRequestBody, async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: 'Short URL is missing in the request body' });
    return;
  } else if (typeof url !== 'string' || url.trim() === '') {
    res.status(400).json({ error: 'URL not valid, insert a valid URL.' });
    return;
  }

  // Check if the URL has the "http://" or "https://" prefix
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    urlWithPrefix = 'http://' + url;
  } else {
    urlWithPrefix = url;
  }

  try {
    const response = await axios.get(urlWithPrefix);

    if (response.status === 200) {
      const originalUrl = response.request.res.responseUrl;

      // Check if the URL already exists in the database
      const existingUrl = await Url.findOne({ originalUrl });

      if (existingUrl) {
        console.log("Entry already exists");
        res.json({ originalUrl: existingUrl.originalUrl });
      } else {
        // Save the new URL if it doesn't already exist
        const newUrl = new Url({ shortUrl: url, originalUrl });
        await newUrl.save();
        console.log("New entry saved");
        res.json({ originalUrl });
      }
    } else {
      res.status(400).json({ error: 'Failed to retrieve the original URL' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL provided' });
  }
});





//api

app.get('/api/unshorten', rateLimiterMiddleware, corsGET, async (req, res) => {
  const shortUrl = req.query.url;
  //
  const header = req.headers
  console.log(header);

  if (!shortUrl) {
    res.status(400).json({ error: 'Short URL parameter is missing' });
    return;
  }

  try {
    // Use the 'url' module to parse the URL and check if it's valid
    const parsedUrl = url.parse(shortUrl);

    // Add the "http://" prefix if missing and if it's not an absolute path
    if (!parsedUrl.protocol && !parsedUrl.host && !parsedUrl.pathname.startsWith('/')) {
      parsedUrl.href = `http://${shortUrl}`;
    }

    const response = await axios.get(parsedUrl.href);

    if (response.status === 200) {
      const originalUrl = response.request.res.responseUrl;
      res.json({ originalUrl });
    } else {
      res.status(400).json({ error: 'Failed to retrieve the original URL' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL provided' });
  }
});




// Custom 404 route
app.use((req, res) => {
  res.status(404).send("404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
