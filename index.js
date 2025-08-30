import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const basicURL = "https://bored-api.appbrewery.com/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(basicURL + "random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);
  try{
    const responce = await axios.get(`${basicURL}filter?
      type=${req.body.type}&participants=${req.body.participants}`);
    const result = responce.data;

    let randomIndex = Math.floor(Math.random() * result.length);
    res.render("index.ejs", { data: result[randomIndex] });
  }

  catch(error){
    if(error.response.status === 404)
      return res.render("index.ejs", { error: "No activities that match your criteria." });

    console.error("Failed to make request:", error);
    res.render("index.ejs", { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
