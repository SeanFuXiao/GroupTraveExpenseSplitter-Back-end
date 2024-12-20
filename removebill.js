const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect("mongodb://localhost:27017/yourDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
};

const updateBills = async () => {
  const Bill = mongoose.model(
    "Bill",
    new mongoose.Schema({}, { strict: false })
  );
  await Bill.updateMany({}, { $unset: { category: "" } });
  console.log("Category field removed from all bills.");
  mongoose.connection.close();
};

connectDb().then(updateBills);
