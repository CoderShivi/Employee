var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');



router.get('/employeedetails',function(req,res){
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    if(admin)
    res.render('employeedetails',{message:''}) 
    else
    res.render('emplogin',{message:''}) 
})

router.post('/employeesubmit',upload.single('picture'),function(req,res){
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    if(!admin)
    res.render('emplogin',{message:''})
    else
    pool.query("insert into employeedetails( firstname,lastname, gender, address, dob, state, city, picture) value(?,?,?,?,?,?,?,?)",[req.body.firstname,req.body.lastname,req.body.gender,req.body.address,req.body.dob,req.body.state,req.body.city,req.file.originalname],function(error,result ){
if(error)
{ 
    res.render('employeedetails',{'message':'server error'})
}

else
{
    res.render('employeedetails',{'message':'Record Submitted Successfuly'})
}

    })
    
})

router.get('/fetchallstates',function(req,res){
   
    pool.query("select * from states",function(error,result){
    if(error)
    
    {
        console.log(error)
        res.status(500).json({result:[],message:'server Error '})
    }

    else
    {
        res.status(200).json({result:result,message:'success'})
    }
    })
   })

    router.get('/fetchallcities',function(req,res){
    pool.query("select * from cities where stateid=?",[req.query.stateid],function(error,result){
        if(error)
    
        {
            
            res.status(500).json({result:[],message:'server Error '})
        }
    
        else
        {
            res.status(200).json({result:result,message:'success'})
        }
    })
})

router.get('/displayallemployees',function(req,res){
    
    pool.query("select E.*,(select s.statename from states s where s.stateid=E.state) as state,(select C.cityname from cities C where C.cityid=E.city) as city from employeedetails E ",function(error,result){
        if(error)
        {
            res.render('displayallemployees',{'data':[],'message':'server error'})
        }
        
        else
        {
            res.render('displayallemployees',{'data':result,'message':'Success'})
        }  
    })   
   })

   

   router.get('/searchbyid',function(req,res){
    
    pool.query("select E.*,(select s.statename from states s where s.stateid=E.state) as state,(select C.cityname from cities C where C.cityid=E.city) as city from employeedetails E where employeeid=?",[req.query.Eid],function(error,result){
        if(error)
        {//console.log(error)
            res.render('employeeid',{'data':[],'message':'server error'})
        }
        
        else
        {//console.log(result)
            res.render('employeeid',{'data':result[0],'message':'Success'})
        }  
    })   
   })

   router.get('/searchbyidforpicture',function(req,res){
    
    pool.query("select E.*,(select s.statename from states s where s.stateid=E.state) as state,(select C.cityname from cities C where C.cityid=E.city) as city from employeedetails E where employeeid=?",[req.query.Eid],function(error,result){
        if(error)
        {
            res.render('showpictures',{'data':[],'message':'server error'})
        }
        
        else
        {
            res.render('showpictures',{'data':result[0],'message':'Success'})
        }  
    })   
   })


   router.post('/employee_edit_delete',function(req,res){
    if(req.body.btn=="Edit")
    {
    console.log(req.body.btn)
    
 pool.query("update employeedetails set firstname=?,lastname=?, gender=?, address=?, dob=?, state=?, city=? where employeeid=?",[req.body.firstname,req.body.lastname,req.body.gender,req.body.address,req.body.dob,req.body.state,req.body.city,req.body.employeeid],function(error,result ){
if(error)
{   console.log(error)
    res.redirect('/employee/displayallemployees')
}

else
{
    res.redirect('/employee/displayallemployees')
}

})
    }
    
 else
 {

    
    
    pool.query("delete from employeedetails where employeeid=?",[req.body.employeeid],function(error,result){
    if(error)
    {
        res.redirect('/employee/displayallemployees')
    }
    
    else
    {
        res.redirect('/employee/displayallemployees')
    }
    
    })
 }
})


router.post('/editpicture',upload.single('picture'),function(req,res){

pool.query("update employeedetails set picture=? where employeeid=?",[req.file.originalname,req.body.employeeid],function(error,result ){
if(error)
{ console.log(error)

    res.redirect('/employee/displayallemployees')
}

else
{
    res.redirect('/employee/displayallemployees')
}

    })
    
})

module.exports=router;