const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Recepie Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


// Recepie Idea Index page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    }); 
});

// Add Recepie Idea Form
router.get('/add', ensureAuthenticated, (req, res) => { // add route
  res.render('ideas/add'); // load view
})

// Edit Recepie Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not authorized');
      res.redirect('/ideas')
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  }) 
})

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please insert the title'});
  }
  if(!req.body.details){
    errors.push({text:'Please insert some details'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }else{
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    
    new Idea(newUser) // Load Recepie Idea Model
      .save()
      .then(idea => {
        req.flash('success_msg', 'Recepie idea added');
        res.redirect('/ideas');
      })

  }

})

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // New values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Recepie updated');
        res.redirect('/ideas')
      })
  });
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('error_msg', 'Recepie idea removed');
    res.redirect('/ideas');
  })
});

module.exports = router;