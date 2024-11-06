const express = require('express');
const blogController = require('../controllers/blog');
const auth = require('../auth');

const router = express.Router();

router.post('/addBlog', auth.isLoggedIn, blogController.addBlog);
router.get('/getBlogs', blogController.getAllBlogs);
router.get('/getBlog/:id', blogController.getBlogById);
router.patch('/updateBlog/:id', auth.isLoggedIn, blogController.updateBlog);
router.delete('/deleteBlog/:id', auth.isLoggedIn, blogController.deleteBlog);
router.post('/addComment/:id', auth.isLoggedIn, blogController.addBlogComment);
router.get('/getComments/:id', blogController.getBlogComments);

module.exports = router;
