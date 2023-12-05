console.log("Connected")
const socket = io()


// let user; 
// const chatBox = document.getElementById("chatBox");
// const messagesLog=document.getElementById("messageLogs");

// Swal.fire({
//     title: "Who are you?",
//     input: "text",
//     text: "Ingrese su email.",
//     inputValidator: (value) =>{
//         return !value && "El email es requerido para ingresar al chat."
//     },
//     allowOutsideClick: false, 
//     allowEscapeKey: false
// }).then(result=>{
// user=result.value;
// socket.emit("authenticated",user);
// });

// chatBox.addEventListener("keyup",evt=>{
//     if(evt.key==="Enter"){
//         if (chatBox.value.trim().length>0){
       
//             socket.emit("message",{user,message:chatBox.value})
        
//             chatBox.value=""; 
//         }
//     }
// })

// socket.on("messageLogs",data=>{
//     let messages="";
//     data.forEach(message=>{
//     messages+=`${message.user} says: ${message.message}<br/>`
//     });
//     messagesLog.innerHTML=messages;
// })

const container = document.getElementById('container')

socket.on('showProducts', data => {
  //  formAdd.addEventListener("submit",function(e){e.preventDefault()})
    container.innerHTML = ``

    data.products.forEach(prod => {
        container.innerHTML += `
            <ul>
                <li>title: ${prod.title}</li> 
                <li>description: ${prod.description}</li>
                <li>code: ${prod.code}</li>
                <li>price: ${prod.price}</li>
                <li>status: ${prod.status}</li>
                <li>stock: ${prod.stock}</li>
                <li>category: ${prod.category}</li>
                <li>id: ${prod.id}</li>
            </ul>
        `
    })
});
