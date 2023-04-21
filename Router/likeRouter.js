const express = require('express');
const router = express.Router();

const {createLike} = require('../Handler/likeHandler');

router
        .route('/:id/like', newlike);

