import {cartsModel} from "../dbManager/models/carts.model.js";
        
export default class Carts {
constructor (){
console.log ("Working with carts from DB");
}

getAll = async ()=>{
const carts = await cartsModel.find().lean();

return carts;
}

getCartById = async (id) => {
    const cart = await cartsModel.findOne({_id:id}).lean();
    return cart;
}

update = async (cid,products) =>{
    const result = await cartsModel.updateOne({_id:cid},products);
    return result;
}

deleteProduct = async (cid,pid) =>{
    const result = await cartsModel.updateOne({_id:cid},{$pull:{products:{product:{_id:pid}}}});
    res.send({status:"success",payload:result})
}

save = async () => {
const result = await cartsModel.create({"products":[]});
return result;
}


}