// Middleware Plugins//
app.use(express.urlencoded({extended:false}));//its also a middle ware // // iske liye mai niche wala next middle ware hu to ye mujhe call karega//

app.use((req,res,next)=>{

    fs.appendFile('log.txt', `\n ${Date.now()} :${req.ip}${req.method}: ${req.path}`, (err,data) => {
next()

    });

console.log('middleware called');

req.myUsername="sachin"
return res.json({"msg":"middleware called"})

})


app.use((req,res,next)=>{
console.log('middleware called 2',req.myUsername);
//return res.end("hey");


next()
})
