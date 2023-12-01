const router = require('express').Router()
const { jsonResponse } = require('../lib/jsonResponse')
router.get('/', (req, res) => {
  res.status(200).json(jsonResponse(200, req.user))
})

module.exports = router
