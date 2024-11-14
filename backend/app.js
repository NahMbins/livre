const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db');

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());

const livreRoutes = require('./routes/livreRoute');

app.use('/api/livre', livreRoutes);

app.use(express.static(path.join(__dirname, 'frontend')));

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
