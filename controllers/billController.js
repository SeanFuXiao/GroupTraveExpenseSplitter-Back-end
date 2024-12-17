const Bill = require("../models/BillModel");

//Create
//Create
exports.createBill = async (req, res) => {
  try {
    const { trip_id, amount, category, description } = req.body;

    if (!trip_id || !amount || !category) {
      return res.json({ error: "Trip ID, amount, and category required" });
    }

    const bill = new Bill({
      trip_id,
      amount,
      category,
      description,
    });

    await bill.save();
    res.json({ message: "Bill created", bill });
  } catch (err) {
    res.son({ error: err.message });
  }
};

//Get all
//Get all

exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate(
      "trip_id",
      "name start_date end_date"
    );
    res.json(bills);
  } catch (err) {
    res.json({ error: err.message });
  }
};

//Get by id
//Get by id

exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate("trip_id", "name");
    if (!bill) return res.json({ error: "Bill not found" });

    res.json(bill);
  } catch (err) {
    res.json({ error: err.message });
  }
};

//Update
//Update

exports.updateBill = async (req, res) => {
  try {
    const { amount, category, description } = req.body;

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      { amount, category, description },
      { new: true, runValidators: true }
    );

    if (!updatedBill) return res.json({ error: "Bill not found" });

    res.json({ message: "Bill updated", updatedBill });
  } catch (err) {
    res.json({ error: err.message });
  }
};

//Delete
//Delete

exports.deleteBill = async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    if (!deletedBill) return res.json({ error: "Bill not found" });

    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};


