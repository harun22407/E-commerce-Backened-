const express = require('express')
const app = express()
require('./db/config')
const User = require('./db/User')
const cors = require("cors")
const Product = require('./db/Product')
app.use(cors())
app.use(express.json())

const Jwt = require('jsonwebtoken')
const jwtKey = 'e-comm';



app.post('/register', async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save()
    result = result.toObject()
    delete result.password
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send({ result: "Something went wrong, please try again after sometime" })
        }
        resp.send({ result, auth: token })
    })
})


app.post('/login', async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password")
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send({ result: "Something went wrong, please try again after sometime" })
                }
                resp.send({ user, auth: token })
            })
        } else {
            resp.send({ result: "No user found" })
        }
    } else {
        resp.send({ result: "No user found" })
    }

})


app.post('/add-product', verifyToken, async (req, resp) => {
    let product = new Product(req.body)
    let result = await product.save()
    resp.send(result)
})


app.get('/products',verifyToken, async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else[
        resp.send({ result: "No products found" })
    ]
})


app.delete('/product/:id',verifyToken, async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    resp.send(result)
})

app.get('/product/:id',verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ result: "No record found" })
    }
})




app.put('/update/:id',verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
})


app.get('/search/:key', verifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }
        ]
    });
    resp.send(result)
})


function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1]
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                resp.status(401).send({result: "Please provide valid token"})
            } else {
                next();
            }
        })
    } else {
        resp.status(403).send({result: "Please add token with header"})
    }
}




app.listen(5000)