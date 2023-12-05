import {chatsModel} from "../dbManager/models/chats.model.js";
        
export default class Chats {
constructor (){
console.log ("Working with messages from DB");
}

getAll = async ()=>{
const messages = await chatsModel.find().lean();

return messages;
}

save = async (message) => {
const result = await chatsModel.create(message);
return result;
}


}