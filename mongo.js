const mongoose = require('mongoose')

if (process.argv.length < 5 && process.argv.length !== 3) {
  console.log('Please provide the password, name, and number as arguments: node mongo.js <password> <data-name> <data-number> or provide only the password')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Speedrace:${password}@cluster0.pmkyy.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
  Person
  .find({})
  .then(persons=> {
    persons.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
else{
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}
