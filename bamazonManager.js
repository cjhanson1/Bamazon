var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Sqlpurp9!',
  database : 'bamazon'
});
connection.connect(); 
connection.query('SELECT * FROM products', function (error, results, fields) {
  if (error) throw error;
  selectTask(results)
});

function selectTask(results){
	inquirer.prompt([
	{
		type:"list",
		name:"task",
		message:"What would you like to do?",
		choices:["View products for sale",'View low inventory','Add to inventory','Add new product']
	}
	])
	.then(function (answers) {
		switch(answers.task){
			case "View products for sale":
				displayProducts(results)
				break;
			case 'View low inventory':
				displayLowInventory(results)
				break;
			case 'Add to inventory':
				addMoreUnits()
				break;
			case 'Add new product':
				addAProduct()
				break;
		}
	});
}
 
function displayProducts(results){
	var productList = results;
	for (i=0;i<results.length;i++){
  		console.log('Item # '+results[i].item_id);
  		console.log(results[i].product_name);
  		console.log('Price $'+results[i].price);
  		console.log('Number of Units: '+results[i].stock_quantity);
  		console.log('--------------------');
  	}
  	connection.end();
}
function displayLowInventory(results){
	var productList = results;
	for (i=0;i<results.length;i++){
		if (results[i].stock_quantity<50){
			console.log('Item # '+results[i].item_id);
	  		console.log(results[i].product_name);
	  		console.log('Price $'+results[i].price);
	  		console.log('Number of Units: '+results[i].stock_quantity);
	  		console.log('--------------------');
		}
  	}
  	connection.end();
}
function addMoreUnits(results){
	inquirer.prompt([
		{
		type:"input",
		name:"item",
		message:"To which product would you like to add inventory? (Item #)"
		},
		{
		type:"input",
		name:"quant",
		message:"How many units are you adding?"
		}
	])
	.then(function (answers) {
		connection.query('SELECT * FROM products WHERE item_id = ?',[answers.item], function (error, results, fields) {
		  if (error) throw error;
		  var oldQuant = results[0].stock_quantity
		  var newQuant = Number(oldQuant)+Number(answers.quant)
		  connection.query('UPDATE products SET stock_quantity =? WHERE item_id = ?',[newQuant,answers.item], function(error,results,fields){
			if(error) throw error;
			console.log("You have successfully updated the inventory.")
			connection.end()
			})
		});
	});
}

function addAProduct(){
	inquirer.prompt([
		{
		type:"input",
		name:"productName",
		message:"Please enter the name of the product."
		},
		{
		type:"input",
		name:"department",
		message:"Please enter the department."
		},
		{
		type:"input",
		name:"price",
		message:"Please enter the price of the product."
		},
		{
		type:"input",
		name:"stockQuant",
		message:"Please enter the stock quantity."
		}
	])
	.then(function (answers) {
		connection.query('INSERT INTO products SET ?',
		{
			product_name : answers.productName,
			department_name : answers.department,
			price : answers.price,
			stock_quantity : answers.stockQuant
		},
		function(error,results,fields){
			if(error) throw error;
			console.log("You have successfully added the product.")
			connection.end()
			})
	});
}

