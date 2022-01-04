const peopleRouter = require('express').Router()
const Person = require('../models/person')

peopleRouter.get('/api/persons/', async (request, response) => {
  const people = await Person.find({})
  response.json(people)
})

peopleRouter.get('/api/persons/info', (request, response) => {
  response.json(`Phonebook has info for som count people ${new Date()}`)
})

peopleRouter
  .get('/:id', async (request, response, next) => {
    const person = await Person.findById(request.params.id)
    if(person){
      response.json(person)
    }
    else{
      response.status(404).end()
    }
})

peopleRouter.post('/api/persons/', async (request, response, next) => {
  const body = request.body
  const updatedPerson = await Person.findOneAndUpdate({name: body.name}, {name: body.name, number: body.number})
  if(!updatedPerson){
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    const savedPerson = await person.save()
    response.json(savedPerson)
  }
  else{
    response.json(updatedPerson)
  }
})

peopleRouter.delete('/api/persons/:id', async (request, response, next) => {
  await Person.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = peopleRouter
