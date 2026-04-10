const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/teacher", require("./routes/teacher"));
app.use("/student", require("./routes/student"));
app.use("/class", require("./routes/class"));
app.use("/session", require("./routes/session"));
app.use("/attendance", require("./routes/attendance"));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});