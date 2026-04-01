const cartModel = require('../models/Cart');
const inventoryModel = require('../models/Inventory');
const userModel = require('../models/User');

const normalizeQty = (quantity) => {
    const qty = Number(quantity);
    return Number.isInteger(qty) && qty > 0 ? qty : null;
};

const addToCart = async (userId, product, quantity = 1) => {
    try {
        const qty = normalizeQty(quantity);
        if (!qty) {
            return { error: 'quantity không hợp lệ' };
        }

        const inventoryOfProduct = await inventoryModel.findOne({ gameId: product });
        if (!inventoryOfProduct) return { error: 'khong ton tai product', statusCode: 404 };

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = await cartModel.create({ userId, products: [] });
        }

        const index = cart.products.findIndex((item) => item.product.toString() === product.toString());
        const available = inventoryOfProduct.stock - inventoryOfProduct.reserved;

        if (index < 0) {
            if (available < qty) {
                return { error: 'so luong san phan trong kho khong du', statusCode: 404 };
            }
            cart.products.push({ product, quantity: qty });
        } else {
            const nextQty = cart.products[index].quantity + qty;
            if (available < nextQty) {
                return { error: 'so luong san phan trong kho khong du', statusCode: 404 };
            }
            cart.products[index].quantity = nextQty;
        }

        await cart.save();
        return cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw new Error('loi khi them game vao gio hang');
    }
};

const getCartByUserId = async (userId) => {
    try {
        const cart = await cartModel.findOne({ userId }).populate('products.product');
        if (!cart) return { userId, products: [] };
        return cart;
    } catch (error) {
        console.error('Error getting cart by user id:', error);
        throw new Error('loi khi lay gio hang');
    }
};

const removeFromCart = async (userId, product, quantity = null) => {
    try {
        const inventoryOfProduct = await inventoryModel.findOne({ gameId: product });
        if (!inventoryOfProduct) return { error: 'khong ton tai product', statusCode: 404 };

        const cart = await cartModel.findOne({ userId });
        if (!cart) return { error: 'trong gio hang khong co san pham nay', statusCode: 404 };

        const index = cart.products.findIndex((item) => item.product.toString() === product.toString());
        if (index < 0) {
            return { error: 'trong gio hang khong co san pham nay', statusCode: 404 };
        }

        if (quantity === null || typeof quantity === 'undefined') {
            cart.products.splice(index, 1);
            await cart.save();
            return cart;
        }

        const qty = normalizeQty(quantity);
        if (!qty) return { error: 'quantity không hợp lệ' };

        if (cart.products[index].quantity > qty) {
            cart.products[index].quantity -= qty;
        } else if (cart.products[index].quantity === qty) {
            cart.products.splice(index, 1);
        } else {
            return { error: 'gio hang khong co du so luong', statusCode: 404 };
        }

        await cart.save();
        return cart;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw new Error('loi khi xoa game ra khoi gio hang');
    }
};

const isGameInCart = async (userId, product) => {
    try {
        const cart = await cartModel.findOne({ userId });
        if (cart) return cart.products.some((item) => item.product.toString() === product.toString());
        return false;
    } catch (error) {
        console.error('Error checking if game is in cart:', error);
        throw new Error('loi khi kiem tra game co trong gio hang');
    }
};

module.exports = {
    addToCart,
    getCartByUserId,
    removeFromCart,
    isGameInCart
};