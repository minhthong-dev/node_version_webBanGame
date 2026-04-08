const cartModel = require('../models/Cart');
const inventoryModel = require('../models/Inventory');
const userModel = require('../models/User');

const normalizeQty = (quantity) => {
    const qty = Number(quantity);
    return Number.isInteger(qty) && qty > 0 ? qty : null;
};

const addToCart = async (userId, gameId, quantity = 1) => {
    try {
        const qty = normalizeQty(quantity);
        if (!qty) {
            return { error: 'quantity không hợp lệ' };
        }
        const inventoryOfGame = await inventoryModel.findOne({ gameId });
        // If game doesn't have inventory record yet, treat as out of stock
        if (!inventoryOfGame) return { error: 'Hết hàng', statusCode: 409 };

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = await cartModel.create({ userId, products: [] });
        }

        const index = cart.products.findIndex((item) => item.product.toString() === gameId.toString());
        const available = inventoryOfGame.stock - inventoryOfGame.reserved;
        if (available <= 0) return { error: 'Hết hàng', statusCode: 409 };

        if (index < 0) {
            if (available < qty) {
                return { error: 'Hết hàng', statusCode: 409 };
            }
            cart.products.push({ product: gameId, quantity: qty });
        } else {
            const nextQty = cart.products[index].quantity + qty;
            if (available < nextQty) {
                return { error: 'Hết hàng', statusCode: 409 };
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

const removeFromCart = async (userId, gameId, quantity = null) => {
    try {
        const inventoryOfGame = await inventoryModel.findOne({ gameId });
        // If inventory record is missing, treat as out of stock (consistent messaging)
        if (!inventoryOfGame) return { error: 'Hết hàng', statusCode: 409 };

        const cart = await cartModel.findOne({ userId });
        if (!cart) return { error: 'trong gio hang khong co san pham nay', statusCode: 404 };

        const index = cart.products.findIndex((item) => item.product.toString() === gameId.toString());
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

const isGameInCart = async (userId, gameId) => {
    try {
        const cart = await cartModel.findOne({ userId });
        if (cart) return cart.products.some((item) => item.product.toString() === gameId.toString());
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