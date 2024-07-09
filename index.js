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

//Retrive user PUUID based on username and hashtag
//Use PUUID to get a list of last 20 played games
app.post('/queryAccount', async (req, res) => {
  const userPUUID = await getPUUID(req, res);

  console.log(userPUUID);
});

//Retrive user PUUID
const getPUUID = async function (req, res) {
  const gameName = req.body.gameName;
  const tagLine = req.body.tagLine;

  try {
    const account = await axios.get(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${RIOT_API_KEY}`
    );
    const accPuuid = account.data.puuid;
    return accPuuid;
    //res.render('index.ejs', { account: accPuuid });
  } catch (error) {
    console.log(error.message);
    res.render('index.ejs', {
      error: `Could find a player with name: ${gameName}.`,
    });
  }
};

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
