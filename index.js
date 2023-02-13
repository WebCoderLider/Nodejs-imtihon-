import express from 'express'
import { read, write } from './utils/utils.js'
import crypto from 'crypto'
const app = express()
import fs from 'fs'
app.get('/', (req, res) => {
    let admins = read('admins')
    let categories = read('categories')
    let products = read('products')
    let subCategories = read('subcategories')

    admins = admins.map(el => {
        el.admin_boshqarishi_mumkin_bolganlar = categories
        return el
    })

    categories = categories.map(category => {
        category.category = subCategories.filter(i => i.category_id == category.categoriy_id)
        return category
    })
    subCategories = subCategories.map(product => {
        product.product = products.filter(i => i.sub_category_id == product.sub_category_id)
        return product
    })
    // subCategories = subCategories.map(subC => {
    //     subC.produc = products
    // })
    res.json(admins)
})
app.get('/admins', (req, res) => {
    const json = read('admins')
    res.json(json)
})
app.post('/admin', (req, res) => {
    let data = ''
    req.on('data', (chunk) => {
        data += chunk
    })
    req.on('end', () => {
        try {
            let user = JSON.parse(data)
            let users = fs.readFileSync("./database/admins.json", 'utf-8')
            users = JSON.parse(users)
            user.admin_id = users.length + 1
            if (users.map(i => i.username) != user.username) {
                user.password = crypto.createHash("sha256").update(user.password).digest("hex")
                users.push(user)
                fs.writeFileSync('./database/admins.json', JSON.stringify(users, null, 4))
                res.writeHead(201)
                res.end('adding')
            }
            else {
                res.end('Bundan admin ro`yhatimizda bor')
            }
        } catch (error) {
            res.end('password string bolishi kerak')
        }
    })
})
// admins ===========================================================
app.get('/categories', (req, res) => {
    // res.json(read('categories'))
    let categories = read('categories')
    let products = read('products')
    let subCategories = read('subcategories')
    subCategories = subCategories.map(product => {
        product.product = products.filter(i => i.sub_category_id == product.sub_category_id)
        return product
    })
    res.json(subCategories)
})
app.post('/categories', (req, res) => {
    let data = ''
    req.on('data', (chunk) => {
        data += chunk
    })
    req.on('end', () => {
        let user = JSON.parse(data)
        let users = fs.readFileSync("./database/categories.json", 'utf-8')
        users = JSON.parse(users)
        user.categoriy_id = users.length + 1
        users.push(user)
        fs.writeFileSync('./database/categories.json', JSON.stringify(users, null, 4))
        res.writeHead(201)
        res.end('qoshildi')
    })
})
app.get('/categories/:id', (req, res) => {
    let subCategory = read('categories')
    let a = subCategory.find(i => i.categoriy_id == req.params.id)
    res.json(a || subCategory)
})
app.delete('/categories/:id', (req, res) => {
    let categories = read('categories')
    let a = categories.filter(i => i.categoriy_id != req.params.id)

    write('categories', a)

    res.json(a)
})
// categories end ================================================
app.get('/subcategories', (req, res) => {
    res.json(read('subcategories'))
})
app.get('/subcategories/:id', (req, res) => {
    let subCategory = read('subcategories')
    let a = subCategory.find(i => i.sub_category_id == req.params.id)
    res.json(a || subCategory)
})
app.post('/subcategories', (req, res) => {
    let data = ''
    req.on('data', (chunk) => {
        data += chunk
    })
    req.on('end', () => {
        let user = JSON.parse(data)
        let users = fs.readFileSync("./database/subcategories.json", 'utf-8')
        users = JSON.parse(users)
        user.sub_category_id = users.length + 1


        users.push(user)
        fs.writeFileSync('./database/subcategories.json', JSON.stringify(users, null, 4))
        res.writeHead(201)
        res.end('qoshildi')
    })
})
app.delete('/subcategories/:id', (req, res) => {
    let subcategories = read('subcategories')
    let a = subcategories.filter(i => i.sub_category_id != req.params.id)

    write('subcategories', a)

    res.json(a)
})
// subcategories end ================================================
app.get('/products', (req, res) => {
    res.json(read('products'))
})
app.post('/products', (req, res) => {
    let data = ''
    req.on('data', (chunk) => {
        data += chunk
    })
    req.on('end', () => {
        let user = JSON.parse(data)
        let users = fs.readFileSync("./database/products.json", 'utf-8')
        users = JSON.parse(users)
        user.product_id = users.length + 1
        users.push(user)
        fs.writeFileSync('./database/products.json', JSON.stringify(users, null, 4))
        res.writeHead(201)
        res.end('qoshildi')

    })
})
app.get('/products/:id', (req, res) => {
    let subCategory = read('products')
    let a = subCategory.find(i => i.product_id == req.params.id)
    res.json(a)
})
app.delete('/ProductDelete/:id', (req, res) => {
    let product = read('products')
    let a = product.filter(i => i.product_id != req.params.id)

    write('products', a)

    res.json(a)
})





// Ustoz manashu put ni qlomadm sal tushunmadm
// Ustoz manashu put ni qlomadm sal tushunmadm
// Ustoz manashu put ni qlomadm sal tushunmadm
// Ustoz manashu put ni qlomadm sal tushunmadm
// Ustoz manashu put ni qlomadm sal tushunmadm
// Ustoz manashu put ni qlomadm sal tushunmadm



// app.put('/product/:id', (req, res) => {
//     let data = ''
//     req.on('data', (chunk) => {
//         data += chunk
//     })
//     req.on('end', () => {
//         let user = JSON.parse(data)
//         let users = read("products")
//         users = users.find(i => i.product_id == req.params.id)
//         users.product_name = user.product_name
//         console.log(users)
//         write('products', users)
//         res.end('ok')
//     })
// })
// products end ================================================
// =======================================================================

app.listen(5000, () => console.log('server run'))