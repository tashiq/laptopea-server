const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());
app.use(cors());
