const express=require('express');
const users=require('./MOCK_DATA.json')
const app=express();
const port=3000;





// Routes

app.get('/users', (req, res) => {
    const html=`
    <ul>

    ${users.map(user=>`<li>${user.first_name}</li>`)}
    </ul>
    `;
    res.send(html);
})

app.get('/api/users', (req, res) => {
    return res.json(users)
})

// rest api

app.route('/api/users/:id').get((req, res) => {
    const id=Number(req.params.id);
const user=users.find((user) => user.id === id)
return res.json(user)
})
.patch((req, res) => {

    // edit user with id
    res.json({status:'pending'})
})
.delete((req, res) => {
    // delete with user id
    res.json({status:'pending'})
})   



app.post('/api/users', (req, res) => {
    // to doo: create new user
    return res.json({status:'pending'});
})



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});