import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const productPath = join (__dirname,"./files/productos.json");
export const  cartPath = join (__dirname, "./files/carritos.json")

export const createHash = password => 
        bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (plainPassword, hashedPassword) => 
    bcrypt.compareSync(plainPassword, hashedPassword);


    export const generateToken = (user) => {
        const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1h' });
        
        return token;
    
    }
    
    
    export const authToken = (req, res, next) => {
       
        const authToken = req.headers.authorization; 
    
        if(!authToken) return res.status(401).send({ status: 'error', message: 'not authenticated' });
    
        
        const token = authToken.split(' ')[1];
       
        jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
            
            if (error) return res.status(401).send({ status: 'error',  message: 'not authenticated'});
            req.user = credentials.user;
            next();
        })
    }
    
// export {
//     __dirname,
//     createHash,
//     isValidPassword
// }