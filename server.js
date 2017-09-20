const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = process.env.PORT || 3000

var itemRoutes = express.Router()

itemRoutes.route('/data').get(function (req, res) {
  res.json({
    data: [
      {
        id: 1,
        name: 'Javascript',
        slug: 'javascript',
        created_at: '2016-03-12'
      },
      {
        id: 11,
        name: 'PHP',
        slug: 'php',
        created_at: '2016-03-12'
      }
    ]
  })
})

app.use('/', itemRoutes)

app.listen(port, function () {
  console.log('Listening on port ' + port)
})
