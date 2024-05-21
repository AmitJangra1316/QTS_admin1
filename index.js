const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const Router = express.Router(); 
const cookieParser = require('cookie-parser');

const app = express();

app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: false, 
    runtimeOptions: {
      allowProtoPropertiesByDefault: true, 
    },
  })
);


// path
const userRouter = require('./router/userrouter');
const adminRouter = require('./router/adminrouter');
const projectRouter = require('./router/projectrouter');

app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
  res.render('login');
});

// database connection
const connectionString = 'mongodb+srv://jenkincoder:D638tx2DWLIan4cm@cluster0.wxoptfd.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connectionString, {
  maxPoolSize: 10, 
});
mongoose.connection.on('connected', () => {
  console.log('Database connection successfully');
});

// router
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/admin',projectRouter);




const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});



