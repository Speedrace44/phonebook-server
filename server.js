require('dotenv').config()
const express = require('express')
const app = express()
const bp = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.static('build'))
app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.data(req, res)
  ].join(' ')
}))
app.use(errorHandler)

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  response.json(`Phonebook has info for som count people ${new Date()}`)
})

app
  .get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if(person){
        response.json(person)
      }
      else{
        response.status(404).end()
      }
    })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  Person.findOneAndUpdate({name: body.name}, {name: body.name, number: body.number})
    .then(updatedPerson => {
      if(!updatedPerson){
        const person = new Person({
          name: body.name,
          number: body.number,
        })
        person.save().then(savedPerson => {
          response.json(savedPerson)
        })
        .catch(error => next(error))
      }
      else{
        response.json(updatedPerson)
      }
    })
    .catch(error => {
      return next(error)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
