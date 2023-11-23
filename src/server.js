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

    // Espera a que el elemento con el nombre y la foto del creador se cargue
    await page.waitForSelector('.g-user-name');
    await page.waitForSelector('.g-avatar__img-wrapper > img'); // Selector para la imagen de perfil

    const result = await page.evaluate(() => {
      const nameElement = document.querySelector('.g-user-name');
      const imageElement = document.querySelector('.g-avatar__img-wrapper > img');

      const name = nameElement ? nameElement.innerText : null;
      const profilePicUrl = imageElement ? imageElement.src : null;

      return { name, profilePicUrl };
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
