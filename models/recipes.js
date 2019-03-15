module.exports = function(sequelize, DataTypes) {
  var Recipes = sequelize.define("Recipes", {
    name: DataTypes.STRING,
    recipeId: DataTypes.INTEGER,
    ingredients: DataTypes.STRING(2000)
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
