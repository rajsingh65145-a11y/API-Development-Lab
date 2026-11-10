const express = require('express');
const fs = require('fs');

const mongoose=require('mongoose');


//const users = require('./MOCK_DATA.json');
const app = express();
const port = 3000;

// mongoose connection
mongoose.connect('mongodb://127.0.0.1:27017/yt-app-1')// cmd se pata chala aur ye yt-app-1 database ka naam jo humne diya hai//

.then(()=>console.log('mongo db connected'))
.catch((err)=>console.log("mongose error",err));

//schema

const   userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },

    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    jobTitle:{
        type:String,
        required:true,
        
    },
    
},
{timestamps:true})// for showing which time add files//


const user=mongoose.model('user',userSchema);

// Middleware Plugins//
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // its also a middle ware

app.use((req, res, next) => {
    fs.appendFile('log.txt', `\n ${Date.now()} : ${req.ip} : ${req.method}: ${req.path}`, (err, data) => {
        next();
    });
});

/*
app.use((req,res,next)=>{
console.log('middleware called 2',req.myUsername);
//return res.end("hey");


next()
})
*/


// Routes

app.get('/users', async(req, res) => {
    const allDbusers=await user.find({});
    const html = `
    <ul>
    ${allDbusers.map(user => `<li>${user.firstName}-${user.email}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

app.get('/api/users',async (req, res) => {
    res.setHeader('X-Myname', 'harsh'); // custom header
    const allDbusers=await user.find({});
    return res.json(allDbusers);
});

// rest api

app.route('/api/users/:id')
    .get(async (req, res) => {
      const founduser = await user.findById(req.params.id);
        
       /* const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);*/
        if (!founduser) return res.status(404).json({ status: 'error', message: 'User not found' });
        return res.json(founduser);
    })
    .patch(async (req, res) => {
        await user.findByIdAndUpdate(req.params.id,{lastName:"changed"})
        return res.json({ status: 'success', message: 'User updated' });
        /*const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return res.status(404).json({ status: 'error', message: 'User not found' });



        users[index] = { ...users[index], ...req.body };
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
            if (err) return res.status(500).json({ status: 'error', message: 'Failed to update user' });
            return res.json({ status: 'success', message: 'User updated' });
        });*/
    })
    .delete(async (req, res) => {
        await user.findByIdAndDelete(req.params.id);
        return res.json({ status: 'success', message: 'User deleted' });
        /*const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return res.status(404).json({ status: 'error', message: 'User not found' });

        users.splice(index, 1);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
            if (err) return res.status(500).json({ status: 'error', message: 'Failed to delete user' });
            return res.json({ status: 'success', message: 'User deleted' });
        });*/
    });

app.post('/api/users', async (req, res) => {

    try {
        const body = req.body;

        const jobTitle = body.Job_title || body.job_title;

        // Validation
        if (
            !body.first_name ||
            !body.last_name ||
            !body.email ||
            !jobTitle
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        // MongoDB document create
        const result = await user.create({
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            jobTitle: jobTitle
        });

        console.log("Result:", result);

        return res.status(201).json({
            status: 'success',
            message: 'User created',
            data: result
        });

    } catch (error) {

        console.log("POST Error:", error);

        // Duplicate email error
        if (error.code === 11000) {
            return res.status(409).json({
                status: 'error',
                message: 'Email already exists'
            });
        }

        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
