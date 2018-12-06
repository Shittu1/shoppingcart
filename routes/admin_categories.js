var express = require('express');
var router = express.Router();

//Get Category model
var Category = require('../models/category');

//GET Category index
router.get('/', function (req, res) {
    Category.find(function (err, categories) {
        if (err) return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });
});

//GET add category
router.get('/add-category', function (req, res) {

    var title = "";

    res.render('admin/add_category', {
        title: title
    });

});

//POST add category
router.post('/add-category', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
        });
    } else {
        Category.findOne({ slug: slug }, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exist, choose another.');
                res.render('admin/add_category', {
                    title: title
                });
            } else {
                var category = new Category({
                    title: title,
                    slug: slug,
                });

                category.save(function (err) {
                    if (err) return console.log(err);
                    req.flash('success', 'Category added');
                    res.redirect('/admin/categories');
                });

            }
        });
    }
});

//GET edit category
router.get('/edit-category/:id', (req, res) => {

    Category.findById(req.params.id,  function(err, category) {
            if(err) return console.log(err);
            
            res.render('admin/edit_category', { //page  exist
                title: category.title,
                id: category._id
            });
        });
    });

//POST edit page
router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        Category.findOne({ slug: slug, _id: { $ne: id } }, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exist choose another.');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            } else {

                Category.findById(id, function (err, category) {
                    if (err) return console.log(err);
                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err) return console.log(err);
                        req.flash('success', 'Category added!');
                        res.redirect('/admin/categories/edit-category/' + id);
                    });
                });
            }
        });
    }
});

//GET delete pages
router.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndDelete(req.params.id, function (err) {
        if (err) return console.log(err);

        req.flash('success', 'Category deleted!');
        res.redirect('/admin/categories');
    });
});


// Exports
module.exports = router;