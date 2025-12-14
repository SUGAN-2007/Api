const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let dbData = {};
try {
  const dbPath = path.join(__dirname, 'db.json');
  const rawData = fs.readFileSync(dbPath, 'utf8');
  dbData = JSON.parse(rawData);
} catch (error) {
  dbData = { clothes: [] };
}

let clothes = dbData.clothes || [];
app.get('/api/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/api`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clothes API Documentation</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #e2e8f0;
      background: #0f172a;
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: #1e293b;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      overflow: hidden;
      border: 1px solid #334155;
    }
    header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
      border-bottom: 2px solid #334155;
      position: relative;
    }
    header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
    }
    header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    header p {
      font-size: 1.1em;
      color: #94a3b8;
    }
    .content {
      padding: 40px;
      background: #1e293b;
    }
    .endpoint {
      background: #0f172a;
      border-left: 4px solid #3b82f6;
      padding: 25px;
      margin-bottom: 30px;
      border-radius: 8px;
      border: 1px solid #334155;
      transition: all 0.3s ease;
    }
    .endpoint:hover {
      border-left-color: #60a5fa;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      transform: translateX(2px);
    }
    .method {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 0.85em;
      margin-right: 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .method.get { background: #10b981; color: white; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3); }
    .method.post { background: #3b82f6; color: white; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); }
    .method.put { background: #f59e0b; color: white; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3); }
    .method.delete { background: #ef4444; color: white; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3); }
    .endpoint-title {
      font-size: 1.5em;
      margin-bottom: 15px;
      color: #ffffff;
      font-weight: 600;
    }
    .endpoint-url {
      background: #0f172a;
      color: #34d399;
      padding: 14px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      margin: 15px 0;
      word-break: break-all;
      border: 1px solid #334155;
      font-size: 0.95em;
    }
    .code-block {
      background: #0f172a;
      color: #e2e8f0;
      padding: 22px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      margin: 15px 0;
      line-height: 1.8;
      border: 1px solid #334155;
    }
    .code-block code {
      color: #34d399;
    }
    .description {
      margin: 15px 0;
      color: #94a3b8;
      font-size: 1.05em;
    }
    .status-codes {
      margin-top: 15px;
      padding: 12px 15px;
      background: rgba(245, 158, 11, 0.1);
      border-left: 3px solid #f59e0b;
      border-radius: 6px;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }
    .status-codes strong {
      color: #fbbf24;
    }
    .status-codes {
      color: #fcd34d;
    }
    .data-structure {
      margin-top: 40px;
      padding: 25px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .data-structure h3 {
      color: #60a5fa;
      margin-bottom: 15px;
      font-size: 1.3em;
    }
    .footer-info {
      margin-top: 30px;
      padding: 25px;
      background: #0f172a;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #334155;
    }
    .footer-info p {
      color: #94a3b8;
      margin: 8px 0;
    }
    .footer-info strong {
      color: #60a5fa;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>REST API</h1>
      <p>Complete API Documentation with Fetch Examples</p>
    </header>
    <div class="content">
      
      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method get">GET</span>
          Get All Clothes
        </div>
        <div class="endpoint-url">${baseUrl}/clothes</div>
        <div class="description">Returns all clothing items in the database.</div>
        <div class="code-block">
<code>fetch('${baseUrl}/clothes')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));</code>
        </div>
        <div class="status-codes">
          <strong>Status Codes:</strong> 200 (Success)
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method get">GET</span>
          Get Clothes by Category
        </div>
        <div class="endpoint-url">${baseUrl}/clothes/category/:category</div>
        <div class="description">Returns all clothing items filtered by category (e.g., "mens", "womens").</div>
        <div class="code-block">
<code>// Example: Get all mens clothing
fetch('${baseUrl}/clothes/category/mens')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));</code>
        </div>
        <div class="status-codes">
          <strong>Status Codes:</strong> 200 (Success), 404 (Category not found)
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method get">GET</span>
          Get Single Clothing Item by ID
        </div>
        <div class="endpoint-url">${baseUrl}/clothes/:id</div>
        <div class="description">Returns a single clothing item by its ID.</div>
        <div class="code-block">
<code>// Example: Get item with ID 1
fetch('${baseUrl}/clothes/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));</code>
        </div>
        <div class="status-codes">
          <strong>Status Codes:</strong> 200 (Success), 404 (ID not found)
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method post">POST</span>
          Add New Clothing Item
        </div>
        <div class="endpoint-url">${baseUrl}/clothes</div>
        <div class="description">Creates a new clothing item. ID is auto-generated. All fields are required.</div>
        <div class="code-block">
<code>fetch('${baseUrl}/clothes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "New T-Shirt",
    image: "/images/new-tshirt.png",
    description: "A comfortable cotton t-shirt",
    category: "mens",
    price: "₹999"
  })
})
  .then(response => response.json())
  .then(data => console.log('Created:', data))
  .catch(error => console.error('Error:', error));</code>
        </div>
        <div class="status-codes">
          <strong>Status Codes:</strong> 201 (Created), 400 (Missing required fields)
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method put">PUT</span>
          Update Clothing Item by ID
        </div>
        <div class="endpoint-url">${baseUrl}/clothes/:id</div>
        <div class="description">Updates an existing clothing item. Only provided fields will be updated.</div>
        <div class="code-block">
<code>// Example: Update item with ID 1
fetch('${baseUrl}/clothes/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "Updated Title",
    price: "₹1299"
    // Other fields are optional
  })
})
  .then(response => response.json())
  .then(data => console.log('Updated:', data))
  .catch(error => console.error('Error:', error));</code>
        </div>
        <div class="status-codes">
          <strong>Status Codes:</strong> 200 (Success), 404 (ID not found)
        </div>
      </div>

      <div class="endpoint">
        <div class="endpoint-title">
          <span class="method delete">DELETE</span>
          Delete Clothing Item by ID
        </div>
        <div class="endpoint-url">${baseUrl}/clothes/:id</div>
        <div class="description">Deletes a clothing item by its ID.</div>
        <div class="code-block">
<code>// Example: Delete item with ID 1
fetch('${baseUrl}/clothes/1', {
  method: 'DELETE'
})
  .then(response => response.json())
  .then(data => console.log('Deleted:', data))
  .catch(error => console.error('Error:', error));</code>
        </div>
        <div class="status-codes">
          <strong>Status Codes:</strong> 200 (Success), 404 (ID not found)
        </div>
      </div>

      <div class="data-structure">
        <h3>📝 Data Structure</h3>
        <div class="code-block">
<code>{
  "id": 1,
  "title": "Black Sleeveless Vest",
  "image": "/images/Black Sleeveless Vest.png",
  "description": "A premium black vest...",
  "category": "mens",
  "price": "₹1199"
}</code>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
  `;
  
  res.send(html);
});

app.get('/api/clothes', (req, res) => {
  res.status(200).json(clothes);
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

  res.status(200).json(filteredClothes);
});

app.get('/api/clothes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = clothes.find(c => c.id === id);

  if (!item) {
    return res.status(404).json({ 
      message: `Clothing item with id ${id} not found` 
    });
  }

  res.status(200).json(item);
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
  res.status(201).json(newItem);
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
  res.status(200).json(updatedItem);
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
  res.status(200).json({ 
    message: 'Clothing item deleted successfully',
    deletedItem 
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Total clothes in memory: ${clothes.length}`);
});

