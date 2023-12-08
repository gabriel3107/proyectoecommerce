import { Router } from "express";
const router = Router();
import ProductManager from './ProductManager.router.js'
// import { __dirname } from "../utils.js";
import { productPath } from '../utils.js';
import ProductManager from '../dao/dbManager/products.manager.js';
import ChatManager from "../dao/dbManager/chat.manager.js";
import CartManager from "../dao/dbManager/carts.manager.js";
import { productsModel } from "../dao/dbManager/models/products.model.js";

// const productsFilePath = path.join(__dirname, "./files/productos.json");
// const productManager = new ProductManager(productsFilePath);

// const router = Router();

// router.get('/', async (req, res) => {
//     try {
//         const coso = await productManager.getProducts();
//         res.render('home', {
//             coso
//         });
//     }
//     catch {

//     }
// });
const productManager= new ProductManager(productPath);
const chatManager= new ChatManager();
const cartManager= new CartManager();

const publicAccess = (req, res, next) => {
    if(req.session?.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if(!req.session?.user) return res.redirect('/login'); 
}

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});
router.get("/products",async (req,res)=>{
    try{
     const {page=1,limit=10,sort,queryValue,query} = req.query; 
     const filtered = (query=="price"||query=="stock")?({[query]: { $gt: queryValue }}):((queryValue)? {[query]:{$regex: queryValue,$options:"i"}} : {});
     const sorted = sort? ({price:sort}) : ({});
     const {docs,hasPrevPage,hasNextPage,nextPage,prevPage}=await productsModel.paginate(filtered,{sort:sorted,page,limit,lean:true})
       
        const prevLink=queryValue? `/products?page=${prevPage}&limit=${limit}&queryValue=${queryValue}&query=${query}`:`/products?page=${prevPage}&limit=${limit}`;
        const nextLink = queryValue? `/products?page=${nextPage}&limit=${limit}&queryValue=${queryValue}&query=${query}`:`/products?page=${nextPage}&limit=${limit}`;
        res.render("home",{
            products:docs,
            
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            limit,
            query,
            queryValue,
            prevLink,
            nextLink
        });}
        catch(error) {return res.send({ status: 'error', error: error })}
    });

    router.get("/home",privateAccess,async (req,res)=>{
        try{
            const {page=1,limit=10,sort} = req.query;
            //si no manda nada, asumo page 1 y limit 10.
    //        const {docs,hasPrevPage,hasNextPage,nextPage,prevPage}=await productsModel.paginate({},{sort:{price:1},page,limit,lean:true})
            const {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages}=await productsModel.paginate({},{sort:{price:sort},page,limit,lean:true});
            //flags para saber si botón hacia adelante o hacia atrás. 
            //primer parámetro de paginate filtro de búsqueda; segundo parámetro parámetros de paginación. Limit fijado en 5, page viene del query. Lean por el POJO.
            //const products = await productManager.getAll();
            const prevLink = hasPrevPage ? `/?page=${prevPage}&limit=${limit}` : null;
            const nextLink= hasNextPage ? `/?page=${nextPage}&limit=${limit}` : null;
            res.send({status:"success",payload:docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,page,prevLink,nextLink
            });}
            catch(error) {return res.send({ status: 'error', error: error })}
        });

//RUTA DE CARRITO
router.get("/carts/:cid",async(req,res)=>{
        try{
            const cid = req.params.cid;
            const cart = await cartManager.getCartById(cid);
            res.render("cart",{cart});
        }
        catch(error){
            console.error(error.message);
        }
    });
    // router.get("/",async (req,res)=>{
    //     try{
    //         const {page=1,limit=10,sort} = req.query;
            
    //         const {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages}=await productsModel.paginate({},{sort:{price:sort},page,limit,lean:true});
           
    //         const prevLink = hasPrevPage ? `/?page=${prevPage}&limit=${limit}` : null;
    //         const nextLink= hasNextPage ? `/?page=${nextPage}&limit=${limit}` : null;
    //         res.send({status:"success",payload:docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,page,prevLink,nextLink
    //         });}
    //         catch(error) {return res.send({ status: 'error', error: error })}
    //     });

router.get("/chat",async(req,res)=>{
    const messages = await chatManager.getAll();
    res.render("chat",{messages});
});

router.get('/register', publicAccess, (req, res) => {
    res.render('register')
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login')
});

router.get('/', privateAccess, (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
});



export default router;