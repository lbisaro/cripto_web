const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../helpers/auth');

const Note = require('../models/Note');

router.get('/notes/add',isAuthenticated,(req,res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req,res) => {

    const {title, description}=req.body;
    const errors = [];
    if (!title)
        errors.push({text: 'Debe ingresar un titulo'});
    if (!description)
        errors.push({text: 'Debe ingresar una descripcion'});   
    if (errors.length > 0)
    {
        res.render('notes/new-note' ,{
            errors,
            title,
            description
        });
    }     
    else
    {
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        newNote.log = [{action: 'Create'}];
        await newNote.save();
        req.flash('success_msg','La nota fue agregada con exito');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated,async (req,res) => {
    const notes = await Note.find({user: req.user.id})
                            .sort({ date: "desc" })
                            .lean();
    res.render("notes/all-notes", { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async (req,res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note',  {note}  );
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) => {
    const {title, description} = req.body;
    const id = req.params.id;
    await Note.findByIdAndUpdate(req.params.id,
        { $set: {title: title, description: description}, $push: {log: {action: 'Update'}}}
        ).lean();
    
    req.flash('success_msg','La nota fue actualizada con exito');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req,res) => {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg','La nota fue eliminada con exito');
    res.redirect('/notes');
});

module.exports = router;