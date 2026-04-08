const gameModel = require('../models/Game');
const Inventory = require('../models/Inventory');
// const userModel = require('../models/userModel');
const gameService = require('../services/gameService');
exports.createGame = async (req, res) => {
    try {
        const gameData = req.body;
        const newGame = await gameService.createGame(gameData);
        return res.status(201).json(newGame);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllGames = async (req, res) => {
    try {
        const games = await gameService.getAllGames();
        return res.status(200).json({ data: games });
    } catch (error) {
        return res.status(500).json({ error: 'loi loi loi' });
    }
};
exports.getGameById = async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await gameService.getGameById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'khong tim thay game' });
        }
        return res.json(game);
    } catch (error) {
        return res.status(500).json({ error: 'loi loi loi' });
    }
};

exports.getGameDetail = async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await gameService.getGameById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Không tìm thấy game' });
        }
        const inventory = await Inventory.findOne({ gameId });
        const stock = inventory ? inventory.stock : 0;
        const reserved = inventory ? inventory.reserved : 0;
        return res.status(200).json({
            ...game.toObject(),
            inventory: {
                stock,
                reserved,
                available: stock - reserved
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.updateGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const gameData = req.body;
        const updatedGame = await gameService.updateGame(gameId, gameData);
        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        return res.json(updatedGame);
    } catch (error) {
        return res.status(500).json({ error: 'loi loi loi' });
    }
}
exports.deleteGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const deletedGame = await gameService.deleteGame(gameId.toString());
        if (!deletedGame) {
            return res.status(404).json({ message: 'khong tim thay game' });
        }
        return res.json({ message: 'thanh cong' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.searchGames = async (req, res) => {
    try {
        console.log('Received search request with query:', req.query);
        const query = req.query;
        const games = await gameService.searchGames(query);
        return res.json(games);
    } catch (error) {
        console.error('Error searching games:', error);
        return res.status(500).json({ error: 'loi loi loi ' });
    }
};
exports.uploadCoverImage = async (req, res) => {
    try {
        const { gameId } = req.body;
        const filePath = req.file.path;
        const result = await gameService.uploadCoverImage(gameId, filePath);
        return res.json({ message: 'Upload thành công', data: result });
    } catch (error) {
        console.error('Lỗi khi upload cover image: ', error);
        return res.status(500).json({ error: error.message });
    }
};
exports.uploadScreenshotImage = async (req, res) => {
    try {
        const { gameId } = req.body;
        const files = req.files.images;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Không có ảnh screenshot nào được tải lên' });
        }
        const result = await gameService.uploadScreenshotImage(gameId, files);
        return res.json({ message: 'Upload thành công', data: result });
    } catch (error) {
        console.error('Lỗi khi upload screenshot: ', error);
        return res.status(500).json({ error: error.message });
    }
}
exports.deleteImage = async (req, res) => {
    try {
        const gameId = req.params.id;
        const { type, imageUrl } = req.body;
        await gameService.deleteImageSer(gameId, type, imageUrl);
        return res.json({ message: 'Xóa ảnh thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa ảnh: ', error);
        return res.status(500).json({ error: error.message });
    }
}
exports.addToWishlist = async (req, res) => {
    try {
        const { gameId, userId } = req.body;
        await gameService.addToWishlist(gameId, userId);
        return res.status(200).json({ message: 'Thêm vào wishlist thành công' });
    } catch (error) {
        console.error('Lỗi khi thêm vào wishlist: ', error);
        return res.status(500).json({ error: error.message });
    }
}
exports.removeFromWishlist = async (req, res) => {
    try {
        const { gameId, userId } = req.body;
        await gameService.removeFromWishlist(gameId, userId);
        return res.status(200).json({ message: 'Xóa khỏi wishlist thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa khỏi wishlist: ', error);
        return res.status(500).json({ error: error.message });
    }
}
exports.isWishlist = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.params.userId;
        const result = await gameService.isWishlist(gameId, userId);
        return res.status(200).json({ isWishlist: result });
    } catch (error) {
        console.error('Lỗi khi kiểm tra wishlist');
        return res.status(500).json({ error: 'loi nhu em' });
    }
}
exports.getWishlistByUserId = async (req, res) => {
    try {
        const userId = req.params.userid;
        const game = await gameService.getWishlistByUserId(userId);
        return res.status(200).json({ message: 'Lấy wishlist thành công', data: game });
    } catch (error) {
        console.error('Lỗi khi lấy wishlist: ', error);
        return res.status(500).json({ error: 'loi nhu em' });
    }
}
exports.like = async (req, res) => {
    try {
        const { gameId, userId } = req.body;
        console.log('gameId: ', gameId, 'userId: ', userId);
        await gameService.like(gameId, userId);
        return res.status(200).json({ message: 'Thêm vào wishlist thành công' });
    } catch (error) {
        console.error('Lỗi khi thêm vào wishlist: ', error);
        return res.status(500).json({ error: error.message });
    }
}
exports.unlike = async (req, res) => {
    try {
        const { gameId, userId } = req.body;
        await gameService.unlike(gameId, userId);
        return res.status(200).json({ message: 'Xóa khỏi wishlist thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa khỏi wishlist: ', error);
        return res.status(500).json({ error: error.message });
    }
}
exports.isLike = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.params.userId;
        const result = await gameService.isLike(gameId, userId);
        return res.status(200).json({ isLike: result });
    } catch (error) {
        console.error('Lỗi khi kiểm tra wishlist');
        return res.status(500).json({ error: 'loi nhu em' });
    }
}
exports.getLikesByUserId = async (req, res) => {
    try {
        const userId = req.params.userid;
        const game = await gameService.getLikesByUserId(userId);
        return res.status(200).json({ message: 'Lấy wishlist thành công', data: game });
    } catch (error) {
        console.error('Lỗi khi lấy wishlist: ', error);
        return res.status(500).json({ error: 'loi nhu em' });
    }
}
exports.getLikesCount = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const result = await gameService.getLikesCount(gameId);
        return res.status(200).json({ message: 'Lấy số lượt thích thành công', data: result });
    } catch (error) {
        console.error('Lỗi khi lấy số lượt thích: ', error);
        return res.status(500).json({ error: 'loi nhu em' });
    }
}
