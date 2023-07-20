const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname+ "/date.js");
const _ = require("lodash");

const app = express();
mongoose.connect('mongodb+srv://email and password of mongodb@cluster0.iiuzzdx.mongodb.net/toDoListDB');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const itemsSchema = {
    name: String
};

const Items= mongoose.model("item", itemsSchema);


const buyFood =new Items({
    name: "buy some good"
});

const cookFood =new Items({
    name: "cook food"
});

const eatFood =new Items({
    name: "eat food"
});

const defaultArray = [buyFood, cookFood, eatFood];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res){
      async function getUsers() {
        try {
          // Find all users
          const foundItems = await Items.find({}).exec();
          if (foundItems.length === 0 ){       
            Items.insertMany(defaultArray).then(function () {
                console.log("Successfully saved defult items to DB");
            }).catch(function (err) {
                console.log(err);
            });
            res.redirect("/");
          } else{
            res.render("list", {listTitle: "Today", newListItems:foundItems});
          }

        } catch (error) {
          console.error(error);
        }
      }
      
      // Call the async function
      getUsers();
    });

app.post("/", function(req,res){
    const itemName = req.body.addList;
    const listName = req.body.list;

    const item = new Items ({
        name: itemName
    });

    if (listName === "Today"){
        item.save();
        res.redirect("/");
    } else {
        
    async function getUsers() {
        try {
          // Find all users
          const foundItem = await List.findOne({name: listName}).exec();
          foundItem.items.push(item);
          foundItem.save();
          res.redirect("/" + listName);

        } catch (error) {
          console.error(error);
        }
      }
      
      // Call the async function
      getUsers();
    }





});

app.post("/delete", function (req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today"){
      Items.findByIdAndRemove(checkedItemId)
      .then(function () {
          console.log("Successfully removed");
      })
      .catch(function (err) {
          console.log(err);
      });
      res.redirect("/");
    } else {
      List.findOneAndUpdate({name: listName}, {$pull:{items:{_id:checkedItemId}}})
      .then(function () {
      })
      .catch(function (err) {
          console.log(err);
      });
      res.redirect("/" + listName);
    }


});

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);


    async function getUsers() {
        try {
          // Find all users
          const foundItem = await List.findOne({name:customListName}).exec();
          if (!foundItem){     
            const list = new List({
                name: customListName,
                items: defaultArray
            });
            list.save();
            res.redirect("/" + customListName);

            
          } else{
            res.render("list", {listTitle: foundItem.name , newListItems:foundItem.items});

          }

        } catch (error) {
          console.error(error);
        }
      }
      
      // Call the async function
      getUsers();
    });


app.post("/work", function(req, res){
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/school", function(req,res){
    res.render("list", {listTitle: "School Work", newListItems:schoolItems});
});

app.post("/school", function(req, res){
    const item = req.body.newItem;
    schoolItems.push(item);
    res.redirect("/school");
});
app.listen(3000, function(){
    console.log("Server started at port 3000");
});
