var inquirer = require("inquirer");
var mysql = require("mysql");
var config = require('./config.js')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : config,
  database : 'bamazon'
});
 
function displayResults(results){
	var productList = results;
	for (i=0;i<results.length;i++){
  		console.log('Item # '+results[i].item_id);
  		console.log(results[i].product_name);
  		console.log('Price $'+results[i].price);
  		console.log('--------------------');
  	}
  	placeOrder();
}

function placeOrder(){
	inquirer.prompt([
	{
		type:"input",
		name:"item_of_purchase",
		message:"Please enter Item # of the product you would like to buy:"
	},
	{
		type:"input",
		name:"quantity_of_purchase",
		message:"Please enter the desired quanity:"
	}
	])
	.then(function (answers) {
		connection.query('SELECT * FROM products WHERE item_id=?',[answers.item_of_purchase], function (error, results, fields) {
			if (error) throw error;
		  	if (answers.quantity_of_purchase>results[0].stock_quantity){
			console.log("We don't have that many units of that item. We only have "+results[0].stock_quantity+'.')
			connection.end()
			}
			else {
			var price = results[0].price
			var quant = results[0].stock_quantity
			newQuant = quant-answers.quantity_of_purchase
			var totalPrice = price*answers.quantity_of_purchase
			connection.query('UPDATE products SET stock_quantity =? WHERE item_id = ?',[newQuant,answers.item_of_purchase], function(error,results,fields){
			if(error) throw error;
			console.log('Your total is $'+totalPrice)
			connection.end()
			})
			}
		});
	});
}

connection.connect(); 
connection.query('SELECT * FROM products', function (error, results, fields) {
  if (error) throw error;
  displayResults(results)
});
// connection.end();



