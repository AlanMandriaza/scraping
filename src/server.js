const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

const app = express();
const port = 5000;
const AWS = require('aws-sdk');

// Configura las credenciales de AWS (AWS SDK v2)
AWS.config.update({
  region: 'us-east-2',
  accessKeyId: 'AKIA2AX2QNKV3WCCT6UP',
  secretAccessKey: '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',
});

app.use(cors());

// Create a DynamoDB client (AWS SDK v3)
const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-2',
  credentials: fromIni({ profile: 'Alan' }), // Replace with your AWS profile name or provide credentials directly
});

app.get('/getCreatorName/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const url = `https://onlyfans.com/${creatorId}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Espera a que los elementos con la información del creador se carguen
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

    if (!result.name || !result.profilePicUrl) {
      throw new Error('Información del creador no encontrada');
    }

    // Define los datos a guardar en la tabla de DynamoDB
    const params = {
      TableName: 'creator', // Reemplaza 'NombreDeTuTabla' con el nombre de tu tabla en DynamoDB
      Item: {
        "creatorID": { S: creatorId },
        "additionalInfo": { S: result.additionalInfo },
        "name": { S: result.name },
        "profilePicUrl": { S: result.profilePicUrl },
        "subscriptionPrice": { S: result.subscriptionPrice },
        "totalElement": { S: result.totalElement }
      },
    };

    // Utiliza el comando PutItemCommand para guardar los datos en la tabla de DynamoDB
    const putItemCommand = new PutItemCommand(params);

    try {
      const response = await dynamoDbClient.send(putItemCommand);
      console.log("Guardado exitosamente en DynamoDB", response);
    } catch (err) {
      console.error("Error al guardar en DynamoDB", err);
    }

    // Enviar la respuesta al cliente
    res.json(result);

  } catch (error) {
    console.error('Error al obtener la información del creador:', error);
    res.status(500).json({ error: 'Error al obtener la información del creador' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
