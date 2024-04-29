import express from "express";
const app = express();
import cors from "cors"
// making a  list of 5 jokes
app.use(cors());
// this must be standardization of the urls
app.get("/api/jokes", (req, res) => {
  try {
    const jokes = [
      { id: 1, name: "joke1", description: "This is my first joke" },
      { id: 2, name: "joke2", description: "This is my second joke" },
      { id: 3, name: "joke3", description: "This is my third joke" },
      { id: 4, name: "joke4", description: "This is my fourth joke" },
      { id: 5, name: "joke5", description: "This is my fifth joke" },
    ];
    res.send(jokes);
  } catch (error) {
    console.error("Error fetching jokes:", error);
    res.status(500).send("Internal Server Error");
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
