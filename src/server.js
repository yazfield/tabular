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
        name: 'Skill',
        slug: 'skill',
        created_at: '14-11-1999'
      },
      {
        id: 11,
        name: 'Skill 1',
        slug: 'skill1',
        created_at: '14-11-1999'
      }
    ]
  })
})

app.use('/', itemRoutes)

app.listen(port, function () {
  console.log('Listening on port ' + port)
})
