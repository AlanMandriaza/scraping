const express = require('express');
const cors = require('cors');

const { fromIni } = require('@aws-sdk/credential-provider-ini');
const { DynamoDBClient, GetItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb'); // Importa ScanCommand
const app = express();
app.use(cors());
const port = 5001; // Asegúrate de que este puerto sea diferente al de server.js

// Configurar cliente DynamoDB
const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-2',
  credentials: fromIni({ profile: 'Alan' }),
});

// Endpoint para obtener información del creador
app.get('/getCreatorData/:creatorId', async (req, res) => {
  const { creatorId } = req.params;
  const params = {
    TableName: 'creator', // Asume que esta es tu tabla en DynamoDB
    Key: { 'creatorID': { S: creatorId } }
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetItemCommand(params));
    if (Item) {
      const creatorData = {
        name: Item.name?.S || "",
        profilePicUrl: Item.profilePicUrl?.S || "",
        additionalInfo: Item.additionalInfo?.S || "",
        subscriptionPrice: Item.subscriptionPrice?.S || "",
        totalElement: Item.totalElement?.S || "", 
      };
      res.json(creatorData);
    } else {
      res.status(404).json({ error: 'Creator not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching creator data' });
  }
});
app.get('/getCreatorIds', async (req, res) => {
  const params = {
    TableName: 'creator', // Asume que esta es tu tabla en DynamoDB
  };

  try {
    const data = await dynamoDbClient.send(new ScanCommand(params));
    const creatorIds = data.Items.map(item => item.creatorID.S);
    res.json({ creatorIds });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching creator IDs' });
  }
});

app.listen(port, () => {
  console.log(`Amazon server listening on port ${port}`);
});
