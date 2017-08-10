var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/notes");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// ===========SCHEMA SETUP====================
var noteSchema = new mongoose.Schema({
  title: String,
  text: String
 });

var Note = mongoose.model("Note", noteSchema);
//============================================

app.get("/", function(req, res){
    Note.find({}, function(err, allNotes){
       if(err){
           console.log(err);
       } else {
          res.render("landing",{notes:allNotes});
       }
    });
 });

app.post("/new", function(req, res){
    var title = req.body.title;
    var text = req.body.text;
    var newNote = {title: title, text: text}
    Note.create(newNote, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

app.get("/:id/edit", function(req,res){

    Note.findById(req.params.id, function(err, foundNote){
        if(err){
            res.redirect("/");
        } else {
            res.render("edit", {note: foundNote});
        }
    });
});

app.put("/:id", function(req, res){
    Note.findByIdAndUpdate(req.params.id, req.body, function(err, updatedNote){
      if(err){
          console.log("some problem at PUT method");
      }  else {
          res.redirect("/");
      }
    });
});


app.delete("/:id", function(req, res){
	Note.findByIdAndRemove(req.params.id, function(err, Note){
      if(err){
          console.log("some error from delete meyhod")
      } else {
         res.redirect('/');
      }
    });
 });


app.listen(3000, function(){
    console.log("The ToDo Server Has Started!");
});