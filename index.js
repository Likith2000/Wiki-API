const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://walter:<pass>@cluster0.vxmc7.mongodb.net/wikiDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema)

/////////////////////////////////////Requests targeting All Routes////////////////////////////////
app.route("/articles")

    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (err) {
                res.send(err)
            } else {
                res.send(foundArticles)
            }
        })
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (err) {
                res.send(err)
            } else {
                res.send("Succesfully added");
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (err) {
                res.send(err)
            } else {
                res.send("Deleted all articles successfully")
            }
        })
    });

/////////////////////////////////////Requests targeting a Specific Route/////////////////////
app.route("/articles/:articleTitle")

    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (err) {
                res.send(err)
            } else {
                res.send(foundArticle)
            }
        })
    })

    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Updated Successfully")
                }
            }
        )
    })

    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Updated Successfully")
                }
            }
        )
    })

    .delete((req, res) => {
        Article.deleteOne(
            { title: req.params.articleTitle },
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Deleted all articles successfully")
                }
            })
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});