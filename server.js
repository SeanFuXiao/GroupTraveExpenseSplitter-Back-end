require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectMongoDB");
const User = require("./models/UserModel");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/auth/exists/:username", async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (user) {
    res.json({ exists: true, id: user.id, username: user.username });
  } else {
    res.json({ exists: false });
  }
});

app.get("/", (req, res) => {
  res.send("HERE is API port, it is running");
});

app.post("/api/trips", async (req, res) => {
  const { name, start_date, end_date, participants } = req.body;

  try {
    for (const participantId of participants) {
      if (!mongoose.Types.ObjectId.isValid(participantId)) {
        return res
          .status(400)
          .json({ error: `Invalid participant ID: ${participantId}` });
      }
    }

    const trip = new Trip({
      name,
      start_date,
      end_date,
      participants,
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

//Routes
//Routes
//=====================================================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/participants", require("./routes/participantRoutes"));
//=====================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
