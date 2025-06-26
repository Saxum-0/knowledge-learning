// routes/security.routes.js
const express = require('express')
const csrf = require('csurf')
const router = express.Router()

const csrfProtection = csrf({ cookie: true })

router.get('/token', csrfProtection, (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.status(200).json({ message: 'CSRF token envoyé' })
})

module.exports = router
