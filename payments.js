/**
 * @author zrthxn
 * --------------------------
 * 
 * Payments server running on a different port from the main server.
 * All requests to this will be encrypted and this will communicate with the 
 * payment portal. After verification this will send encrypted responses.
 * 
 * talking to this server wont be allowed without
 * - CSRF Token verification
 * - Keccak-512 payment key
 * 
 * All requests & responses will be two way encrypted 
 * 
 * Event Chain
 * 
 * User completes form -> sends to payments
 * 
 * 
 * --------------------------
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const payments = express();

const PORT = process.env.PORT || 3000;
const ServerConfig = require('./config.json');
const __domain = require('./config.json').domain;

const Security = require('./util/Security');
const Gmailer = require('./util/Gmailer');
const GSheets = require('./util/GSheets');
const ConsoleScreen = require('./util/ConsoleScreen');

payments.use(bodyParser.json())
payments.use(bodyParser.urlencoded({ extended: true }))
payments.use(express.json())
payments.use(express.urlencoded({ extended: true }))