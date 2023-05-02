const express = require('express');
const router = express.Router();

const AuthorController = require('../controllers/authorController');
const BlogController = require('../controllers/blogController');
const middleware = require('../middleware/auth');


router.post('/authors', AuthorController.createAuthor);

router.get("/findAuthor",AuthorController.findAuthor)

router.put("/updateAuthor/:authorId", AuthorController.updateAuthor)

router.delete("/deleteAuthor/:authorId", AuthorController.deleteAuthor)

router.post('/blogs', middleware.authenticate, BlogController.createBlog);

router.get('/blogs', middleware.authenticate, BlogController.getAllBlogs);

router.put('/blogs/:blogId',middleware.authenticate,middleware.authorise,BlogController.updateBlog);

router.delete('/blogs/:blogId',middleware.authenticate,middleware.authorise,BlogController.deleteByParams);


router.post('/login', AuthorController.loginAuthor);

module.exports = router;
