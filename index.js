const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })
  .then(() => {
    //iteration 2
  
    const tarte = {
      title: 'Chocolate Tarte',
      level: 'Amateur Chef',
      ingredients: [
        '2 cups plain flour, plus more for dusting',
        '3 tablespoons sugar',
        '1/4 teaspoon salt',
        '3/4 cup (1 1/2 sticks) unsalted butter, cold and cut into small chunks',
        '1 large egg, separated',
        '2 tablespoons ice water, plus more if needed',
        '1 cup double cream',
        '1/2 cup milk',
        '10 ounces milk chocolate, chopped',
        '2 tablespoons sugar',
        '1/4 teaspoon salt',
        '2 large eggs, at room temperature'
      ],
      cuisine: 'French',
      dishType: 'dessert',
      duration: 110,
    }

    const promiseCreate = Recipe.create(tarte)
      .then(
        function(newRecipe) {
          console.log('The title of the new recipe is: ', newRecipe.title)
        }
      )
      .catch(
        function(err) {
          console.log('An error occured when adding the new recipe to the database: ', err)
        }
      ); 


    //iteration 3
    
    const promiseInsertMany = Recipe.insertMany(data)
      .then(
        function(recipes) {
          recipes.forEach(recipe => console.log(`--> recipe: ${recipe.title}`))
        }
      )
      .catch(
        function(err) {
          console.log('An error occured when adding recipes to the database: ', err)
        }
      );

    // iteration 4

    const queryToUpdate = {'title': 'Rigatoni alla Genovese'};
    const newUpdate = {'duration': 100}
    const promiseUpdate = Recipe.updateOne(queryToUpdate, newUpdate)
        .then(() => console.log('We successfully changed the duration time: ', newUpdate.duration))
        .catch(err => console.log('An error occured when updating an query: ', err));

    
    // iteration 5
    const deleteQuery = {title: 'Carrot Cake'}
    const promiseDelete = Recipe.deleteOne(deleteQuery)
        .then(() => console.log('Recipe was successfully deleted from the database.'))
        .catch(err => console.log('An error has occured while deleting an query: ', err));
    
    Promise.all([promiseCreate, promiseInsertMany,promiseUpdate, promiseDelete])
      .then(() => {
        console.log('The connection with the database is closed.')
        mongoose.connection.close()
      })
      .catch(err => console.log('An error occured when closing the database: ', err))

  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
