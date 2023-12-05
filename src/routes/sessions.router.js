import { Router } from 'express';
import usersModel from '../dao/dbManager/models/users.model.js';
import passport from 'passport';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name:firstName, last_name:lastName, email, age, password } = req.body;

        if (!firstName|| !lastName || !email || !age || !password) {
            return res.status(422).send({ status: 'error', message: 'incomplete values' });
        }

        const exists = await usersModel.findOne({ email });

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'user already exists' });
        }
       

        await usersModel.create({
            first_name: firstName,
            last_name: lastName,
            email,
            age,
            password
      
        })

        res.status(201).send({ status: 'success', message: 'user registered' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

router.get('/fail-register', async (req, res) => {
    res.status(500).send({ status: 'error', message: 'register fail' });
});
router.post('/login', passport.authenticate('login', { failureRedirect: 'fail-login' }), async (req, res) => {
    if(!req.user) { 
        return res.status(401).send({ status: 'error', message: 'invalid credentials' })
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        isAdmin:(req.user.email=="adminCoder@coder.com")
    }
    res.send({ status: 'success', message: 'login success' })
});

router.get('/fail-login', async (req, res) => {
    res.status(500).send({ status: 'error', message: 'login fail' });
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).send({ status: 'error', message: error.message });
        res.redirect('/'); 
    })
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req, res) => {
    res.send({ status: 'success', message: 'user registered' }); //dentro del middleware pongo "github" porque en passport.use lo llamé github. El scope tb viene de ahí.
});

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async(req, res) => {
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    isAdmin:(req.user.email=="adminCoder@coder.com")
}  
  res.redirect('/');
});

export default router;