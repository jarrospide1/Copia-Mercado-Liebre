const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let productsArray = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const {validationResult} = require('express-validator')

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', { productsArray });
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const theProduct = productsArray.find( oneProduct => oneProduct.id === Number(req.params.id));
		res.render('detail', { theProduct: theProduct });
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			//return res.json(validationErrors)
			//return res.json(validationErrors.mapped())
			return res.render('product-create-form', {
				errors: validationErrors.mapped(),
				oldBodyData: req.body
			})
		} 
		
		//generar ID
		const generateId = () => {
			// 1. Obtenemos el ultimo producto almacenado en la DB
			const lastProduct = productsArray[productsArray.length - 1];
			// 2. Obtenemos el ID de ese ultimo producto
			const lastId = lastProduct.id;
			// 3. Retornamos ese ultimo Id incrementado en 1
			return lastId + 1
		}
/*
		productsArray.push({
			id: generateId(),
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: req.file.filename
		});
*/		
		productsArray.push({
			id: generateId(),
			...req.body,
			image: req.file.filename
			
		});
		

		fs.writeFileSync(productsFilePath, JSON.stringify(productsArray, null, ' '));

		res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const productToEdit = productsArray.find(oneProduct => oneProduct.id === Number(req.params.id));
		res.render('product-edit-form', {productToEdit: productToEdit});
	},
	// Update - Method to update
	update: (req, res) => {
		let productToEdit = productsArray.find(oneProduct => oneProduct.id === Number(req.params.id));

		productToEdit = {
			...req.body,
			//image: req.file.filename
		}

		res.redirect('/product')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		productsArray = productsArray.filter( oneProduct => oneProduct.id !== Number(req.params.id));
		fs.writeFileSync(productsFilePath, JSON.stringify(productsArray, null, ' '));

		res.redirect('/products');

	}
};

module.exports = controller;