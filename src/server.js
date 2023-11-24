const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

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

    // Espera a que el elemento con el nombre, la foto y la información adicional del creador se cargue
    await page.waitForSelector('.g-user-name');
    await page.waitForSelector('.g-avatar__img-wrapper > img'); // Selector para la imagen de perfil
    await page.waitForSelector('.b-user-info__text'); // Selector para la información adicional del creador

    const result = await page.evaluate(() => {
      const nameElement = document.querySelector('.g-user-name');
      const imageElement = document.querySelector('.g-avatar__img-wrapper > img');
      const infoElement = document.querySelector('.b-user-info__text'); // Elemento para la información adicional

      const name = nameElement ? nameElement.innerText : null;
      const profilePicUrl = imageElement ? imageElement.src : null;
      const additionalInfo = infoElement ? infoElement.innerText : null; // Extrae la información adicional

      return { name, profilePicUrl, additionalInfo };
    });

    await browser.close();

    if (!result.name || !result.profilePicUrl) {
      throw new Error('Información del creador no encontrada');
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
