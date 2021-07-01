
'use strict'

const express = require('express');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const config = require('./config');
const Product = require('./models/product');
const bodyParser = require('body-parser');
const app = express();

//npm i --save -express-session
//const expressSession = require('express-session');

//activacion de las sesiones (cookies)

//app.use(expressSession({
  //sercret: 'ittgogalgos',
  //resave: true,
  //saveUnitialized: true
//}))

// $ npm i -S method-override
const methodOverride = require('method-override');
const { Router } = require('express');
app.use(methodOverride('_method'));


// llamamos a los otros modulos, creados en route.js
//const router = require('./routers/routes')
//const { connect } = require('mongodb')
//app.use('/',router)


app.use(express.urlencoded({extended : false}));
app.use(express.json());

app.engine('.hbs', hbs({
    defaultLayout: 'index',
    extname: '.hbs'
  }));
  app.set('view engine', '.hbs');
  
  app.use('/static',express.static('public'));
  
app.get('/',(req,res) =>{
    res.render('home')
});

//insertar datos
app.get('/insertar', (req, res)=>{
   res.render('product');
});

app.get('/products', (req, res)=>{
  res.render('products')
});


//pagina login
const loginController = require('./controllers/login');
app.get('/auth/login', loginController);

const loginUserController = require('./controllers/loginUser');
app.post('/users/login', loginUserController);


// pagina registro nuevos usuarios (para ir al formulario)
const newUser = require('./controllers/newUser');
app.get('/users/register', newUser);


//metodo POST para el registro de usuarios (para registrarse en la BD)
const newUserController = require('./controllers/storeUser');
app.post('/auth/register', newUserController);



app.get('/api/product',(req, res) =>{
  Product.find({},(err,products)=>{
  if(err) return res.status(500).send({message:`Error al realizar la peticion${err}`});
  if(!products) return res.status(404).send({message:`No existen productos`});
  //res.status(200).send( {products:[products]})
  console.log(products);
  res.render('products',{products});
}).lean();
  
});

app.get('/api/product/:productId',(req,res)=>{
    let productId = req.params.productId
   // console.log(req.body)
    Product.findById(productId,(err,products) =>{
      // Product.find({price:productId},(err,todook)=>{
        if(err) return res.status(500).send({message:`Error al realizar la peticion${err}`})
        if(!products) return res.status(404).send({message:`El producto no existe`})
        //res.status(200).send({product:todook})
        res.render('editar',{products})
    }).lean();
});


//Insertar valores en la BD
app.post('/api/product',(req,res)=>{
    console.log('POST /api/product')
    console.log(req.body)
    //res.status(200).send({message:'El producto se a recibido'})
    let product = new Product()
    product.name = req.body.name
    product.picture = req.body.avatar
    product.price = req.body.price
    product.category = req.body.category
    product.description = req.body.description
      //console.log(req.body)
    product.save((err, productStored) =>{
        if (err) res.status(500).send({message:`Error al salvar en BD ${err}`})

        //res.status(200).send({product: productStored})
        res.redirect('/api/product')
    });
});

//Busqueda de datos y modificar
app.put('/api/product/:productId',(req,res)=>{
   
    let productId = req.params.productId
    console.log(`EL product es: ${productId}`)
    
    let update = req.body
    console.log(update)
    
   // Product.findAndModify({_id:productId}, update,(err,products)=> {
       Product.findOneAndUpdate({_id:productId}, update,(err,products)=> {
        if (err) res.status(500).send({message:`Error al actualizar el producto el producto ${err}`})
        //res.status(200).send({product: products})
       res.redirect('/api/product')
       
    });
});

app.delete('/api/product/:productId',(req,res)=>{
    let productId = req.params.productId;

    Product.findById(productId,(err,product)=>{
     if (err) res.status(500).send({message:`Error al borrar el producto ${err}`})

     product.remove(err => {
      if (err) res.status(500).send({message:`Error al borrar el producto ${err}`})
   
     res.redirect('/api/product')
  })

    });
});


//conexión a la BD
mongoose.connect('mongodb+srv://juan:Juanmongo98k@crud.tzlus.mongodb.net/tienda?retryWrites=true&w=majority', config.urlParser,(err, res)=>{

  if(err)
    {
        return console.log(`Error al conectar en la BD ${err}`)
    }
    console.log(`Conexion a la BD exitosa`)
    
    app.listen(config.port, ()=>{
        console.log(`Ejecutando en :${config.port}`)
    });
});

//pagina 404 not found
app.use((req,res)=>{
  res.status(404).send('Pagina no encontrada');
});
