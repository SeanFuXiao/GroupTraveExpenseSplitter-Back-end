require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/UserModel");
const Trip = require("./models/TripModel");
const Bill = require("./models/BillModel");
const BillParticipant = require("./models/BillParticipantModel");
const Participant = require("./models/ParticipantModel");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//1.User
const testUser = async () => {
  try {
    const newUser = await User.create({
      username: "testuser",
      password: "password123",
    });
    console.log("User created:", newUser);
  } catch (err) {
    console.error("Error creating user:", err.message);
  }
};

//2.Trip
const testTrip = async () => {
  try {
    const newTrip = await Trip.create({
      user_id: "64f1b9a5349f2b0012345678",
      name: "Summer Vacation",
      start_date: new Date("2024-06-01"),
      end_date: new Date("2024-06-10"),
    });
    console.log("Trip created:", newTrip);
  } catch (err) {
    console.error("Error creating trip:", err.message);
  }
};

//3.Bill

const testBill = async () => {
  try {
    const newBill = await Bill.create({
      trip_id: "64f1b9a5349f2b0012345679",
      amount: 100,
      category: "Food",
      description: "Dinner at a restaurant",
    });
    console.log("Bill created:", newBill);
  } catch (err) {
    console.error("Error creating bill:", err.message);
  }
};

//5.Participant
const testParticipant = async () => {
  try {
    const newParticipant = await Participant.create({
      trip_id: "64f1b9a5349f2b0012345679",
      user_id: "64f1b9a5349f2b0012345678",
      amount_owed: 75,
      amount_paid: 50,
    });
    console.log("Participant created:", newParticipant);
  } catch (err) {
    console.error("Error creating participant:", err.message);
  }
};

// const runTests = async () => {
//     await testUser();
//     await testTrip();
//     await testBill();
//     await testParticipant();

//     mongoose.disconnect();
// };

// runTests();

const clearDatabase = async () => {
  const User = require("./models/UserModel");
  const Trip = require("./models/TripModel");
  const Bill = require("./models/BillModel");
  const Participant = require("./models/ParticipantModel");

  await User.deleteMany({});
  await Trip.deleteMany({});
  await Bill.deleteMany({});
  await Participant.deleteMany({});

  console.log("All test data has been cleared.");
};

clearDatabase();
