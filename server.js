const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let dbData = {};
try {
  const dbPath = path.join(__dirname, 'db.json');
  const rawData = fs.readFileSync(dbPath, 'utf8');
  dbData = JSON.parse(rawData);
} catch (error) {
  dbData = { clothes: [] };
}

let clothes = dbData.clothes || [];

function convertImageToAbsoluteUrl(item, req) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  if (item.image && item.image.startsWith('/')) {
    item.image = baseUrl + item.image;
  }
  return item;
}

app.get('/api/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/api`;
  const htmlPath = path.join(__dirname, 'index.html');
  
  try {
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace(/\{\{BASE_URL\}\}/g, baseUrl);
    res.send(html);
  } catch (error) {
    res.status(500).json({ message: 'Error loading documentation' });
  }
});

app.get('/api/clothes', (req, res) => {
  const itemsWithAbsoluteUrls = clothes.map(item => convertImageToAbsoluteUrl({ ...item }, req));
  res.status(200).json(itemsWithAbsoluteUrls);
});

app.get('/api/clothes/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const filteredClothes = clothes.filter(item => 
    item.category.toLowerCase() === category
  );

  if (filteredClothes.length === 0) {
    return res.status(404).json({ 
      message: `No clothes found for category: ${req.params.category}` 
    });
  }

  const itemsWithAbsoluteUrls = filteredClothes.map(item => convertImageToAbsoluteUrl({ ...item }, req));
  res.status(200).json(itemsWithAbsoluteUrls);
});

app.get('/api/clothes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = clothes.find(c => c.id === id);

  if (!item) {
    return res.status(404).json({ 
      message: `Clothing item with id ${id} not found` 
    });
  }

  const itemWithAbsoluteUrl = convertImageToAbsoluteUrl({ ...item }, req);
  res.status(200).json(itemWithAbsoluteUrl);
});

app.post('/api/clothes', (req, res) => {
  const { title, image, description, category, price } = req.body;

  if (!title || !image || !description || !category || !price) {
    return res.status(400).json({ 
      message: 'Missing required fields: title, image, description, category, price' 
    });
  }

  const maxId = clothes.length > 0 
    ? Math.max(...clothes.map(item => item.id)) 
    : 0;
  const newId = maxId + 1;

  const newItem = {
    id: newId,
    title,
    image,
    description,
    category,
    price
  };

  clothes.push(newItem);
  const itemWithAbsoluteUrl = convertImageToAbsoluteUrl({ ...newItem }, req);
  res.status(201).json(itemWithAbsoluteUrl);
});

app.put('/api/clothes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = clothes.findIndex(c => c.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ 
      message: `Clothing item with id ${id} not found` 
    });
  }

  const { title, image, description, category, price } = req.body;
  const existingItem = clothes[itemIndex];

  const updatedItem = {
    id: existingItem.id,
    title: title !== undefined ? title : existingItem.title,
    image: image !== undefined ? image : existingItem.image,
    description: description !== undefined ? description : existingItem.description,
    category: category !== undefined ? category : existingItem.category,
    price: price !== undefined ? price : existingItem.price
  };

  clothes[itemIndex] = updatedItem;
  const itemWithAbsoluteUrl = convertImageToAbsoluteUrl({ ...updatedItem }, req);
  res.status(200).json(itemWithAbsoluteUrl);
});

app.delete('/api/clothes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = clothes.findIndex(c => c.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ 
      message: `Clothing item with id ${id} not found` 
    });
  }

  const deletedItem = clothes.splice(itemIndex, 1)[0];
  const itemWithAbsoluteUrl = convertImageToAbsoluteUrl({ ...deletedItem }, req);
  res.status(200).json({ 
    message: 'Clothing item deleted successfully',
    deletedItem: itemWithAbsoluteUrl
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found' 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error' 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Total clothes in memory: ${clothes.length}`);
});

