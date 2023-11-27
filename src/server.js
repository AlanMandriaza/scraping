const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const AWS = require('aws-sdk');
const { getCreatorIds } = require('./dynamodbOperations'); // Asegúrate de que este archivo exista

// Leer la configuración
const configPath = '../config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Configuración de AWS (AWS SDK v2)
AWS.config.update({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});

// Crear aplicación Express
const app = express();
const port = 5000;

app.use(cors());

// Crear cliente de DynamoDB (AWS SDK v3)
const dynamoDbClient = new DynamoDBClient({
  region: config.region,
  credentials: fromIni({ profile: 'Alan' }),
});

// Endpoint to Get Creator Name and Info by ID
app.get('/getCreatorName/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const url = `https://onlyfans.com/${creatorId}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for creator information elements to load
    await page.waitForSelector('.g-user-name');
    await page.waitForSelector('.g-avatar__img-wrapper > img');
    await page.waitForSelector('.b-user-info__text');
    await page.waitForSelector('.b-offer-join');
    await page.waitForSelector('.b-tabs__nav__link__counter-title');

    const result = await page.evaluate(() => {
      const nameElement = document.querySelector('.g-user-name');
      const imageElement = document.querySelector('.g-avatar__img-wrapper > img');
      const infoElement = document.querySelector('.b-user-info__text');
      const subscriptionElement = document.querySelector('.b-offer-join');
      const mediaElement = document.querySelector('.b-tabs__nav__link__counter-title');

      const name = nameElement ? nameElement.innerText : null;
      const profilePicUrl = imageElement ? imageElement.src : null;
      const additionalInfo = infoElement ? infoElement.innerText : null;
      const subscriptionPrice = subscriptionElement ? subscriptionElement.innerText.trim() : 'No disponible';
      const totalElement = mediaElement ? mediaElement.innerText.trim() : 'No disponible';

      return { name, profilePicUrl, additionalInfo, subscriptionPrice, totalElement };
    });

    await browser.close();

    // Handle result and save to DynamoDB
    if (!result.name || !result.profilePicUrl) {
      throw new Error('Creator information not found');
    }

    const params = {
      TableName: 'creator',
      Item: {
        "creatorID": { S: creatorId },
        "name": { S: result.name },
        "profilePicUrl": { S: result.profilePicUrl },
        "additionalInfo": { S: result.additionalInfo },
        "subscriptionPrice": { S: result.subscriptionPrice },
        "totalElement": { S: result.totalElement }
      }
    };

    const putItemCommand = new PutItemCommand(params);
    try {
      const response = await dynamoDbClient.send(putItemCommand);
      console.log("Successfully saved to DynamoDB", response);
    } catch (err) {
      console.error("Error saving to DynamoDB", err);
      throw new Error('Error saving to DynamoDB');
    }

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching creator info' });
  }
});

// Endpoint para obtener todos los IDs de creadores de DynamoDB
app.get('/getCreatorIds', async (req, res) => {
  try {
    const creatorIds = await getCreatorIds('url'); // Usar el nombre de tu tabla DynamoDB
    res.json({ creatorIds });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener los IDs de creadores' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
