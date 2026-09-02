const Product = require ("../models/Product")


// create product
const createProduct = async (req, res) =>{
    const { name, description, price, category, stock, image } = req.body;
    try {
        if(!name || !description || !price || !category){
            return res.json({success: false, message: "Required fields are missing"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image
        })
        res.json({
            message:"product create successfully",
            product,
        })

    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message: "Error"
        })
    }
};

// Get all product

const getAllProducs = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({success: true, products})


    } catch (error) {
        console.log(error)
        return res.json({success: false, message:"Error"})
    }
};

// get single product

const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.json({success:false, message:"Product not found"})
        }

        res.json({success: true, product})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
};

// update product

const updateProduct = async (req, res) =>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.json({success:false, message:"Product not found"})
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )

        res.json({
            success: true,
            message:"Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

// delete product

const deleteProduct = async (req, res) =>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.json({
                success: fasle,
                message: "Product not found"
            })
        }

        const deletedProduc = await Product.findByIdAndDelete(req.params.id)
        res.json({
            success: true,
            message: "Product deleted successfully",
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Error"
        })
    }
}
 
module.exports = {
    createProduct, 
    getAllProducs, 
    getSingleProduct,
    updateProduct,
    deleteProduct, 
}