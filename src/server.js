const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());

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

    // Descargar y guardar la imagen
    if (result.profilePicUrl) {
      const imageUrl = result.profilePicUrl;
      const imageFileName = `${result.name}.jpg`;
      const imagePath = path.join(__dirname, 'profile_pics', imageFileName); // Ruta para guardar la imagen en /src/profile_pics

      // Descarga la imagen utilizando axios
      const response = await axios.get(imageUrl, { responseType: 'stream' });

      // Guarda la imagen en el sistema de archivos local
      const imageStream = response.data;
      const writer = fs.createWriteStream(imagePath);
      imageStream.pipe(writer);

      // Espera a que se complete la escritura antes de continuar
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.log(`Imagen guardada como: ${imagePath}`);
    }

    res.json(result);
  } catch (error) {
    console.error('Error al obtener la información del creador:', error);
    res.status(500).json({ error: 'Error al obtener la información del creador' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});