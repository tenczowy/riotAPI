import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import config from './public/config.js';
import axios from 'axios';
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;
const app = new express();
const RIOT_API_KEY = config.RIOT_API_KEY;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/account', async (req, res) => {
  res.render('getAccount.ejs');
});

app.post('/queryAccount', async (req, res) => {
  const gameName = req.body.gameName;
  const tagLine = req.body.tagLine;

  const account = await axios.get(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${RIOT_API_KEY}`
  );
  const accPuuid = account.data.puuid;

  console.log(accPuuid);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
