import React, { useState } from "react"

const AddProduct = () => {

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [company, setCompany] = useState("")
    const [err, setErr] = useState(false)




    const addProduct = async () => {

        if (!name || !price || !category || !company) {
            setErr(true)
            return false;
        }

        console.log(name, price, category, company);
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        let result = await fetch('http://localhost:5000/add-product', {
            method: "post",
            body: JSON.stringify({ name, price, category, company, userId }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

            }
        })

        result = await result.json()
        console.log(result)
    }


    return (
        <div className="product">
            <h1>Add Product</h1>
            <input className="inputBox" type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} />
            {err && !name && <span className="invalid-input">Enter Valid name</span>}

            <input className="inputBox" type="text" placeholder="Enter product price" value={price} onChange={(e) => setPrice(e.target.value)} />
            {err && !price && <span className="invalid-input">Enter Valid price</span>}

            <input className="inputBox" type="text" placeholder="Enter product category" value={category} onChange={(e) => setCategory(e.target.value)} />
            {err && !category && <span className="invalid-input">Enter Valid category</span>}

            <input className="inputBox" type="text" placeholder="Enter product company" value={company} onChange={(e) => setCompany(e.target.value)} />
            {err && !company && <span className="invalid-input">Enter Valid company</span>}

            <button className="appButton" onClick={addProduct}>Add Product</button>
        </div>
    )
}

export default AddProduct;