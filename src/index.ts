require('dotenv').config();

import { Bot } from "./bot";
import container from "./inversify.config";
import { TYPES } from "./types";


const bot = container.get<Bot>(TYPES.Bot);

bot
  .listen()
  .then(() => {
    console.log('Successfully logged in')
  })
  .catch(error => {
    console.error('Error: ', error)
  })

