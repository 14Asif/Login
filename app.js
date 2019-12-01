const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const exphbs=require('express-handlebars');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const mongoose=require('mongoose');
const port=2345;

//Route Files
const index=require('./routes/index');
//const users=require('./routes/users');
//Init app
const app=express();

//View Engine
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

//Body Parser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Express Session MiddleWare
app.use(session({
secret:'secret',
saveUninitialized:true,
resave:true
}));
//init passport
app.use(passport.initialize());
app.use(passport.session());
//Express messages
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
      res.locals.user=req.user||null;
  next();
});
//Expres validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('/',index);
//app.use('/users',users);
app.listen(port,()=>{
  console.log('Server started on port'+port);
});
