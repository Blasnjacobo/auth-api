const router = require('express').Router()
const getTokenFromHeader = require('../auth/getTokenFromHeader')
const { jsonResponse } = require('../lib/jsonResponse')
const Token = require('../schema/token')
router.delete('/', async (req, res) => {
  try {
    const refreshToken = getTokenFromHeader(req.headers)

    if (refreshToken) {
      await Token.findOneAndDelete({ token: refreshToken })
      res.status(200).json(jsonResponse(200, { message: 'Token deleted' }))
    } else {
      res.status(500).json(jsonResponse(500, { error: 'Server error when refreshToken' }))
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(jsonResponse(500, { error: 'Server error' }))
  }
})

module.exports = router
