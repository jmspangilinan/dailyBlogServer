const Blog = require('../models/Blog');

// Create Blog (Accessible to all users)
module.exports.addBlog = (req, res) => {
    const { title, author, year, description, genre } = req.body;
    const newBlog = new Blog({ title, author, year, description, genre, userId: req.user.id });

    newBlog.save()
        .then(blog => res.status(201).send({ message: 'Blog added successfully', blog }))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Get All Blogs
module.exports.getAllBlogs = (req, res) => {
    Blog.find()
        .then(blogs => res.status(200).send({ message: 'Get Blogs', blogs }))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Get Blog by ID
module.exports.getBlogById = (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) return res.status(404).send({ message: 'Blog not found' });
            res.status(200).send(blog);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Update Blog (Accessible to all users, but only blog owner or admin can update)
module.exports.updateBlog = (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) return res.status(404).send({ message: 'Blog not found' });

            // Check if userId exists and validate ownership
            if (blog.userId && blog.userId.toString() !== req.user.id && !req.user.isAdmin) {
                return res.status(403).send({ message: 'Unauthorized to update this blog' });
            }

            // Update blog details
            Object.assign(blog, req.body);

            return blog.save();
        })
        .then(updatedBlog => res.status(200).send({ message: 'Blog updated successfully', blog: updatedBlog }))
        .catch(err => res.status(500).send({ message: err.message }));
};


// Delete Blog (Accessible to all users, but only blog owner or admin can delete)
module.exports.deleteBlog = (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) return res.status(404).send({ message: 'Blog not found' });

            // Check if userId exists and validate ownership
            if (blog.userId && blog.userId.toString() !== req.user.id && !req.user.isAdmin) {
                return res.status(403).send({ message: 'Unauthorized to delete this blog' });
            }

            // Use deleteOne on the blog document
            return blog.deleteOne();
        })
        .then(() => res.status(200).send({ message: 'Blog deleted successfully' }))
        .catch(err => res.status(500).send({ message: err.message }));
};



// Add Comment to Blog
module.exports.addBlogComment = (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    Blog.findById(id)
        .then(blog => {
            if (!blog) return res.status(404).send({ message: 'Blog not found' });

            blog.comments.push({ user: req.user.id, text });
            return blog.save();
        })
        .then(updatedBlog => res.status(200).send({ message: 'Comment added successfully', blog: updatedBlog }))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Get Comments for a Blog
module.exports.getBlogComments = (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) return res.status(404).send({ message: 'Blog not found' });
            res.status(200).send(blog.comments);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};
