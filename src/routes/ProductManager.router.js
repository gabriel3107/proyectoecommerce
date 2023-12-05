// import fs from 'fs';
import { Router } from 'express';
import { productPath } from '../utils.js';
const router = Router();

import ProductManager from "../dao/dbManager/products.manager.js"
const productManager= new ProductManager(productPath);

router.get('/', async (req, res) => {
    try{
    const products = await productManager.getAll();
    return res.status(200).send({status: "success", payload:products})}
    catch(error) {return res.send({ status: 'error', error: error })}
});

router.get("/:pid", async(req,res)=>{
    try{
        const {pid} =req.params;
        const product = await productManager.getProductById(pid)
        if (!product){
            return res.status(404).send({status:"error",message:"Product not found"})
        }
        res.send({status:"success",payload:product});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send({error:error.message});}
})

router.delete("/:pid", async (req,res)=>{
    try {
    const {pid} =req.params;
    const result = await productManager.delete(pid);
    const io = req.app.get('socketio');
    const products=await productManager.getAll();
    io.emit("showProducts", {products:await productManager.getAll()});
    res.status(201).send({status:"success",payload:result});
    }
    catch(error) {
    res.status(500).send({status:"error",message:error.message})}
    });

router.post("/", async (req,res)=>{
    try {
    const {title,description,price,thumbnail,code,category,stock,status} = req.body;
    const io = req.app.get('socketio');
 
    if (!title || !description || !price || !code || !category ||!stock) {
    return res.status(400).send({status:"error", message:"incomplete values"})};
    const result = await productManager.save({
        title, 
        description,
        price,
        thumbnail,
        code,
        category,
        stock,
        status});
    if (!result) {return res.status(400).send({status:"error",message:"product already exists"})};
    const products=await productManager.getAll();
    io.emit("showProducts", {products:products});
    res.status(201).send({status:"success",payload:result});
    }
    catch(error) {
    res.status(500).send({status:"error",message:error.message})}
    });

router.put("/:pid", async (req,res)=>{
    try {
    const {title,description,price,thumbnail,code,category,stock,status} = req.body;
    const {pid} =req.params;
    const io = req.app.get('socketio');
    //va segunda la variable que quiero definir, primero va como la recibo.
    if (!title || !description || !price || !code || !category ||!stock) {
    return res.status(400).send({status:"error", message:"incomplete values"})};
    const result = await productManager.update(pid,{
        title, 
        description,
        price,
        thumbnail,
        code,
        category,
        stock,
        status});
    const products=await productManager.getAll();
    io.emit("showProducts", {products:products});
    res.status(201).send({status:"success",payload:result});
    }
    catch(error) {
    res.status(500).send({status:"error",message:error.message})}
    });

export default router;

// class ProductManager {
//     constructor(path) {
//         this.path = path;
//     }

//     getProducts = async () => {
//         try {
//             if (fs.existsSync(this.path)) {
//                 const data = await fs.promises.readFile(this.path, 'utf-8');
//                 const products = JSON.parse(data);
//                 return products;
//             }
//             else {
//                 return [];
//             }
//         } catch (error) {
//             console.log(error);
//             throw error;
//         }
//     }

//     addProduct = async (product) => {
//         try {
//             const allProducts = await this.getProducts();

//             product.id = allProducts.length === 0 ? 1 : allProducts[allProducts.length - 1].id + 1;
//             allProducts.push(product);

//             await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, '\t'));
//             return product;

//         } catch (error) {
//             console.log(error);
//             throw error;
//         }
//     }

//     deleteProduct = async (id) => {
//         try {
//             const allProducts = await this.getProducts();
//             const productIndex = allProducts.findIndex(p => p.id === id);

//             if (productIndex != -1) {
//                 allProducts.splice(productIndex, 1);
//                 await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, '\t'));
//             }

//         } catch (error) {
//             console.log(error);
//             throw error;
//         }
//     }
// }

// export default ProductManager;