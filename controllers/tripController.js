const Trip = require("../models/TripModel");
const Bill = require("../models/BillModel");
const Participant = require("../models/ParticipantModel");
const User = require("../models/UserModel");

// Create Trip
exports.createTrip = async (req, res) => {
  try {
    const { name, start_date, end_date, participants } = req.body;

    if (!participants.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid participant ID(s)" });
    }

    const newTrip = new Trip({
      name,
      start_date,
      end_date,
      participants,
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip" });
  }
};

// Get All Trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user_id: req.user.id })
      .populate("user_id", "username")
      .populate("participants", "username")
      .select("_id name start_date end_date user_id participants");

    if (!trips.length) {
      return res.status(404).json({ message: "No trips found for this user" });
    }

    const formattedTrips = trips.map((trip) => ({
      id: trip._id,
      user_id: trip.user_id,
      name: trip.name,
      start_date: trip.start_date,
      end_date: trip.end_date,
      participants: trip.participants.map((p) => p.username),
    }));

    res.json(formattedTrips);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get Trip Details
exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("user_id", "username")
      .populate("participants", "username");

    if (!trip) return res.json({ error: "Trip not found" });

    const bills = await Bill.find({ trip_id: trip._id }).populate(
      "payer_id",
      "username"
    );

    const totalCost = bills.length
      ? bills.reduce((sum, bill) => sum + bill.amount, 0)
      : 0;

    res.json({
      id: trip._id,
      name: trip.name,
      total_cost: totalCost,
      start_date: trip.start_date,
      end_date: trip.end_date,
      participants: trip.participants.map((p) => ({
        id: p._id,
        username: p.username,
      })),
      bills: bills.map((bill) => ({
        id: bill._id,
        description: bill.description,
        amount: bill.amount,
        payer: bill.payer_id?.username || "Unknown",
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Trip
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

// Delete Trip
exports.deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    // 删除与该 Trip 相关的 Participants
    await Participant.deleteMany({ trip_id: tripId });

    // 删除 Trip 本身
    const trip = await Trip.findByIdAndDelete(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res
      .status(200)
      .json({ message: "Trip and related participants deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: error.message });
  }
};
// exports.getTripDetails = async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id)
//       .populate("user_id", "username")
//       .populate("participants", "username");

//     if (!trip) return res.status(404).json({ error: "Trip not found" });

//     const bills = await Bill.find({ trip_id: trip._id });

//     const totalCost = bills.reduce((sum, bill) => sum + bill.amount, 0);

//     const participants = await Participant.find({ trip_id: trip._id }).populate(
//       "user_id",
//       "username"
//     );

//     const perPersonCost = participants.length
//       ? totalCost / participants.length
//       : 0;

//     const updatedParticipants = participants.map((participant) => {
//       const balance = participant.amount_paid - perPersonCost;
//       return {
//         username: participant.user_id.username,
//         amount_paid: participant.amount_paid,
//         amount_owed: perPersonCost,
//         balance,
//       };
//     });

//     res.json({
//       id: trip._id,
//       name: trip.name,
//       total_cost: totalCost,
//       start_date: trip.start_date,
//       end_date: trip.end_date,
//       participants: updatedParticipants,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
