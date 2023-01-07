var express=require('express')
var router=express.Router()
var pool=require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/emplogin',function(req,res){
res.render('emplogin',{message:''})   
})

router.get('/emplogout',function(req,res){
    localStorage.clear()
    res.render('emplogin',{message:''})   
    })
    


router.post('/chkemplogin',function(req,res,next){
    pool.query("select * from emplogin where (empemail=? or mobileno=?) and password=?",[req.body.empemail,req.body.empemail,req.body.password],function(error,result){
        if(error)
        {  
            res.render('emplogin',{message:'Server Error'})   
        }
        else
        {
            if(result.length==1)
            {  
                localStorage.setItem("ADMIN",JSON.stringify(result[0]))
                res.render('dashboard',{data: result})      
            }
            else
            {
                res.render('emplogin',{message:'Invalid emailid or  password'})   
            }
        }
    })
})

module.exports = router;
