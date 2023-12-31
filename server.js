const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

app.use(express.json());

const options = {
  swaggerDefinition: {
    info: {
      title: 'Personal Budget API @Sagar Nayar',
      version: '2.0.0',
      description: 'Personal Budget API autogenerated~~~~~~Rights Reserved',
    },
  },
  apis: ['./server.js'],
};
const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

const prices = {
  food: [
    {
      name: 'apple',
      price: 50,
    },
    {
      name: 'orange',
      price: 90,
    },
    {
      name: 'banana',
      price: 25,
    },
  ],
};

function validatePriceRequest(req, res, next) {
  const { name, price } = req.body;
  if (!name || typeof name !== 'string' || price === undefined || isNaN(price)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  next();
}

/**
 * @swagger
 * /prices:
 *   get:
 *     description: Return all prices
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Object 'food' objects with prices
 */
app.get('/prices', (req, res) => {
  res.json(prices);
});

/**
 * @swagger
 * /prices:
 *   post:
 *     description: ADD UP A NEW PRICE
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: price
 *         description: The price to add
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: number
 *     responses:
 *       201:
 *         description: Successfully added the price to the item
 *       400:
 *         description: Invalid request
 */
app.post('/prices', validatePriceRequest, (req, res) => {
  const newPrice = req.body;
  newPrice.price = parseFloat(newPrice.price.toFixed(2));
  prices.food.push(newPrice);
  res.status(201).json(newPrice);
});

/**
 * @swagger
 * /prices/{name}:
 *   patch:
 *     description: Update the price of a specific item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: The name of the item to update
 *         in: path
 *         required: true
 *         type: string
 *       - name: price
 *         description: The new price to set
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: number
 *     responses:
 *       200:
 *         description: Successfully updated the price
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Item not found
 */
app.patch('/prices/:name', validatePriceRequest, (req, res) => {
  const itemName = req.params.name;
  const newPrice = req.body.price;

  const itemToUpdate = prices.food.find((item) => item.name === itemName);
  if (!itemToUpdate) {
    return res.status(404).json({ error: 'Item not found' });
  }

  itemToUpdate.price = parseFloat(newPrice.toFixed(2));
  res.json(itemToUpdate);
});

/**
 * @swagger
 * /prices/{name}:
 *   put:
 *     description: Replace the price of a specific item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: The name of the item to replace
 *         in: path
 *         required: true
 *         type: string
 *       - name: price
 *         description: The new price to set
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: number
 *     responses:
 *       200:
 *         description: Successfully replaced the price
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Item not found
 */
app.put('/prices/:name', validatePriceRequest, (req, res) => {
  const itemName = req.params.name;
  const newItem = req.body;

  const itemIndex = prices.food.findIndex((item) => item.name === itemName);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  newItem.price = parseFloat(newItem.price.toFixed(2));

  prices.food[itemIndex] = newItem;
  res.json(newItem);
});

/**
 * @swagger
 * /prices/{name}:
 *   delete:
 *     description: Delete a specific item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: The name of the item to delete
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted the item
 *       404:
 *         description: Item not found
 */
app.delete('/prices/:name', (req, res) => {
  const itemName = req.params.name;

  const itemIndex = prices.food.findIndex((item) => item.name === itemName);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  prices.food.splice(itemIndex, 1);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`API server at http://67.205.148.193:${port}`);
});