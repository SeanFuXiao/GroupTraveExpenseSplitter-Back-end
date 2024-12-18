const Trip = require("../models/TripModel");
const Bill = require("../models/BillModel");
const Participant = require("../models/ParticipantModel");

// Create Trip
// Create Trip

exports.createTrip = async (req, res) => {
  try {
    const { user_id, name, start_date, end_date } = req.body;

    const trip = new Trip({ user_id, name, start_date, end_date });
    await trip.save();

    res.json({ message: "Trip created", trip });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get All Trip
// Get All Trip

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("user_id", "username");
    res.json(trips);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get Trip Detail
// Get Trip Detail

exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("user_id", "username")
      .populate("participants", "username");

    if (!trip) return res.json({ error: "Trip not found" });

    const bills = await Bill.find({ trip_id: trip._id });
    trip.total_cost = bills.reduce((sum, bill) => sum + bill.amount, 0);

    const participants = await Participant.find({ trip_id: trip._id }).populate(
      "user_id",
      "username"
    );
    const perPersonCost = trip.total_cost / participants.length;

    const updatedParticipants = participants.map((participant) => {
      const balance = participant.amount_paid - perPersonCost;
      return {
        username: participant.user_id.username,
        amount_paid: participant.amount_paid,
        amount_owed: perPersonCost,
        balance,
      };
    });

    res.json({
      trip: {
        name: trip.name,
        total_cost: trip.total_cost,
        start_date: trip.start_date,
        end_date: trip.end_date,
      },
      participants: updatedParticipants,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Update
// Update

exports.updateTrip = async (req, res) => {
  try {
    const { name, start_date, end_date } = req.body;

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { name, start_date, end_date },
      { new: true }
    );
    if (!updatedTrip) return res.json({ error: "Trip not found" });

    res.json({ message: "Trip updated", updatedTrip });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Delete
// Delete

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    await Bill.deleteMany({ trip_id: trip._id });
    await Participant.deleteMany({ trip_id: trip._id });
    await trip.deleteOne();

    res.json({ message: "Trip and related data deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
