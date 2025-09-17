const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/feed", require("./routes/feed"));  
app.use("/api/myrequest", require("./routes/myrequest"));
app.use("/api/requests", require("./routes/request"));
app.get("/", (req, res) => res.send("HireHelper API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
