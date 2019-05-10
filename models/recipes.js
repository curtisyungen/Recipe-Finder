module.exports = function(sequelize, DataTypes) {
  var Recipes = sequelize.define("Recipes", {
    recipeId: DataTypes.STRING(500),
    recipeName: DataTypes.STRING(500),
    ingredients: DataTypes.STRING(2000),
    rating: DataTypes.INTEGER(5)
  });

  Recipes.associate = function(models) {
    Recipes.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  
  return Recipes;
};
