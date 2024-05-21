const model = require('../models/usermodel');
const User = model.User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../models/projectmodel');
const Project = models.Project;



exports.login = async (req, res) => {
    const doc = await User.findOne({ email: req.body.email });
    const isauth = await bcrypt.compare(req.body.password, doc.password);
    const token = jwt.sign({ email: req.body.email }, 'shhhhh');
    const name = doc.firstName;
    const projects = await Project.find();
    const userprojects = projects.filter((e)=>e.assignedUsers.includes(doc._id));
   
    res.cookie('jwt', token, {
        httpOnly: true,
    });

    doc.lastLogin = new Date();

    doc.token = token;
    await doc.save();

    if (isauth) {
       return res.render('client',{name,projects:userprojects});
    } else {
        res.render('login');
    }
};



exports.readlogin = (req, res) => {
    res.render('login');
}

exports.readsignup = (req, res) => {
    res.render('clientsignup');
}



exports.logout =async (req,res)=>{
    try{
    res.clearCookie('jwt');
    req.user.token = null;
    console.log('logout successfull');
    await  req.user.save();
    res.render('login');
    }catch(error){
        console.log(error);
    }
}



exports.signup = async (req, res) => {
    try {
        const user = new User(req.body);
        const token = jwt.sign({ email: req.body.email }, 'shhhhh');
        const hash = bcrypt.hashSync(req.body.password, 10);

        user.token = token;
        user.password = hash;
        res.cookie('jwt', token, {
            httpOnly: true,
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

