const express = require('express');
const categoryModel = require('../models/Category');
//const { update } = require('apt');


const getAllCategories = async () => {
    try {
        const categories = await categoryModel.find();
        return categories;
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách thể loại');
    }
}
const getByIdCategories = async (id) => {
    try {
        const category = await categoryModel.findById(id);
        return category;
    } catch (error) {
        throw new Error('Lỗi khi lấy thể loại theo id');
    }
}
//admin
const createCategory = async (name) => {
    try {
        const newCategory = new categoryModel({ name });
        await newCategory.save();
        return newCategory;
    } catch (error) {
        throw new Error('Lỗi khi tạo thể loại mới');
    }
}
const updateCategory = async (id, name) => {
    try {
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, { name }, { new: true });
        return updatedCategory;
    } catch (error) {
        throw new Error('Lỗi khi cập nhật thể loại');
    }
}
const deleteCategory = async (id) => {
    try {
        await categoryModel.findByIdAndDelete(id);
        return { message: 'Thể loại đã được xóa' };
    } catch (error) {
        throw new Error('Lỗi khi xóa thể loại');
    }
}


module.exports = {
    createCategory,
    getAllCategories,
    getByIdCategories,
    updateCategory,
    deleteCategory
};