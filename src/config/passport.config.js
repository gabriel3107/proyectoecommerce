import passport from 'passport';
import local from 'passport-local'; 
import usersModel from '../dao/dbManager/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import CartManager from "../dao/dbManager/carts.manager.js";

const cartManager = new CartManager(cartPath);
const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.d0316ca7ee14b316',
        clientSecret: '01269d4a15bd9f7f07b8b585b51bd54f0654ea08',
        callbackURL: 'https://github.com/apps/authespri',
        scope: ['user:email'] 
    }, async (accessToken, refreshToken, profile, done) => { 
        try {

            const carrito = await cartManager.save();
            const email = profile.emails[0].value; 
            const user = await usersModel.findOne({ email });

            if(!user) {
                
                const newUser = {
                    first_name: profile._json.login,
                    last_name: ' ', 
                    age: 5000, 
                    email,
                    password: ' ',
                    cart: carrito._id,
                    
                }

                const result = await usersModel.create(newUser);
                return done(null, result); 
            } else {
                return done(null, user);
            }
        } catch (error) {
            console.log(error)
            return done(`Incorrect credentials`)
        }
    }));


passport.use('register', new LocalStrategy({ 
        passReqToCallback: true, 
        usernameField: 'email' 
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, age, cart} = req.body; 
            if (!first_name|| !last_name || !username || !age || !password) {
                return done(null,false);
            }
            const user = await usersModel.findOne({ email: username }); 
            if(user) {
                return done(null, false); 
            }

            const userToSave = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password),
                cart,
                role: username==="adminCoder@coder.com"? ("admin") : ("user")
            }

            const result = await usersModel.create(userToSave);
            return done(null, result); 
        } catch (error) {
            return done(`Incorrect credentials`)
        }
    }));

 passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username });

            if(!user || !isValidPassword(password, user.password)) {
                return done(null, false)
            }

 return done(null, user); 

        } catch (error) {
            return done(`Incorrect credentials`)
        }
    }));
 passport.serializeUser((user, done) => {
        done(null, user._id); 
    });

 passport.deserializeUser(async(id, done) => { 
        const user = await usersModel.findById(id);
        done(null, user); 
    })
}

export {
    initializePassport
}