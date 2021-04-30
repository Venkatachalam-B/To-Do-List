

const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
mongoose.set('useFindAndModify', false);
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-venkat:Venkat@123@cluster0.iceun.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema ={
  name:"String"
};
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
  name:"To do"
});
const item2=new Item({
  name:"List"
});

const defaultItems =[item1];


app.get("/", function(req, res){

  var today =new Date();
  var options = {
    weekDay: "long",
     day: "numeric",
    month:"long"
  };
  var day = today.toLocaleDateString("en-US",options);
  Item.find({},function(err,found){
    if(found.length ===0)
    {
      Item.insertMany(defaultItems,function(err)
      {
        if(err){
          console.log(err);
        }
        else{

        console.log("success");}
      });
      res.redirect("/");
    }
    else
    {

      res.render("list", {listTitle: day, newListItems: found});
    }

  });
});
app.post("/",function(req,res){
   let itemN = req.body.newItem;
   const item=new Item({
     name:itemN
   });
   item.save();
   res.redirect("/");

});
app.post("/delete",function(req,res){
  const checkeditemId= req.body.checkbox;
  Item.findByIdAndRemove(checkeditemId,function(err)
{
  if(!err)
  {
    console.log("No Error");
    res.redirect("/");
  }
});
});




app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000.");
});
