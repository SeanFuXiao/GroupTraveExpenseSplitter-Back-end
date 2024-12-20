const Trip = require("../models/TripModel");
const Bill = require("../models/BillModel");
const Participant = require("../models/ParticipantModel");
const User = require("../models/UserModel");

// Create Trip
// Create Trip
exports.createTrip = async (req, res) => {
  try {
    const { name, start_date, end_date, participants } = req.body;

    const participantsObjectIds = await Promise.all(
      participants.map(async (username) => {
        const user = await User.findOne({ username });
        if (!user) throw new Error(`User not found: ${username}`);
        return user._id;
      })
    );

    const trip = new Trip({
      user_id: req.user.id,
      name,
      start_date,
      end_date,
      participants: participantsObjectIds,
    });

    await trip.save();
    res.json({ message: "Trip created", trip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Trip
// Get All Trip

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

// Get Trip Detail
// Get Trip Detail

exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("user_id", "username")
      .populate("participants", "username");

    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const bills = await Bill.find({ trip_id: trip._id }).populate(
      "payer_id",
      "username"
    );

    const formattedBills = bills.map((bill) => ({
      id: bill._id,
      description: bill.description || "No Description",
      amount: bill.amount || 0,
      payer: bill.payer_id?.username || "Unknown",
    }));

    const totalCost = bills.reduce((sum, bill) => sum + bill.amount, 0);

    const participants = await Participant.find({ trip_id: trip._id }).populate(
      "user_id",
      "username"
    );

    const balances = participants.map((participant) => ({
      user_id: participant.user_id._id,
      username: participant.user_id.username,
      amount_paid: participant.amount_paid || 0,
      amount_owed: participant.amount_owed || 0,
      balance: (participant.amount_paid || 0) - (participant.amount_owed || 0),
    }));

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
      bills: formattedBills,
      balances: balances,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    // 删除关联数据
    await Bill.deleteMany({ trip_id: trip._id });
    await Participant.deleteMany({ trip_id: trip._id });

    // 删除 Trip
    await trip.deleteOne();

    res.json({ message: "Trip and related data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
