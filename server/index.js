const { response } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const port = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://admin:bemarideuta1@employee.lubsn6h.mongodb.net/assignment"
  )
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

// const MongoClient = mongodb.MongoClient;
// const uri =
//   "mongodb+srv://admin:bemarideuta1@employee.lubsn6h.mongodb.net/assignment";

const DataSchema = mongoose.Schema({
  // _id: String,
  title: String,
  language: String,
  overview: String,
  popularity: Number,
  // releaseDate: Date,
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Data = new mongoose.model("Data", DataSchema);

app.use(express.json());

app.post("/api/data", async (req, res) => {
  const newData = new Data({
    // _id: req.body._id,
    title: req.body.title,
    language: req.body.language,
    overview: req.body.overview,
    popularity: req.body.popularity,
  });

  try {
    await newData.save();
    res.json({ message: "Data saved successfully", data: req.body });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error });
  }

  console.log(req.body);
});

app.get("/api/getdata", async (req, res) => {
  const data = await Data.find({});
  res.json(data);
});

app.put("/api/updatedata/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid data id" });
    }
    const updatedData = req.body;
    const data = await Data.findByIdAndUpdate(id, { $set: updatedData });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating data" });
  }
});

app.delete("/api/deletedata/:id", async (req, res) => {
  // const deletedData = req.body;
  // const { id } = req.params.id;
  try {
    const _id = req.params.id;
    console.log("deleteUser", _id);
    const data = await Data.findByIdAndDelete(_id);
    // const result = await Data.findByIdAndUpdate(id, { $set: deletedData });
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating data" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
