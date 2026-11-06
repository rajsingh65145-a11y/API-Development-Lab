const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const app = express();
const port = 3000;


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

app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

app.get('/api/users', (req, res) => {
    res.setHeader('X-Myname', 'harsh'); // custom header
    return res.json(users);
});

// rest api

app.route('/api/users/:id')
    .get((req, res) => {

        
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return res.status(404).json({ status: 'error', message: 'User not found' });



        users[index] = { ...users[index], ...req.body };
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
            if (err) return res.status(500).json({ status: 'error', message: 'Failed to update user' });
            return res.json({ status: 'success', message: 'User updated' });
        });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return res.status(404).json({ status: 'error', message: 'User not found' });

        users.splice(index, 1);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
            if (err) return res.status(500).json({ status: 'error', message: 'Failed to delete user' });
            return res.json({ status: 'success', message: 'User deleted' });
        });
    });

app.post('/api/users', (req, res) => {

     
    const body = req.body;
    const jobTitle = body.Job_title || body.job_title;
    if (!body.first_name || !body.last_name || !body.email || !jobTitle) {
        return res.status(400).json({ status: 'error', message: 'All field are required' });
    }


    const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    const newId = maxId + 1;
    const newUser = { ...body, Job_title: jobTitle, id: newId };
    users.push(newUser);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) return res.status(500).json({ status: 'error', message: 'Failed to create user' });
        return res.status(201).json({ status: 'success', id: newId });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
