const Participant = require("../models/ParticipantModel");
const Trip = require("../models/TripModel");

// Create Participant
// Create Participant

exports.addParticipant = async (req, res) => {
  try {
    const { trip_id, user_id } = req.body;
    const participant = new Participant({ trip_id, user_id });
    await participant.save();

    const trip = await Trip.findById(trip_id);
    if (!trip) return res.json({ error: "Trip not found" });

    trip.participants.push(user_id);
    await trip.save();

    res.json({ message: "Participant added", participant });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get all Partocoant bt Trip
// Get all Partocoant bt Trip

exports.getParticipantsByTrip = async (req, res) => {
  try {
    const participants = await Participant.find({
      trip_id: req.params.trip_id,
    }).populate("user_id", "username");
    res.json(participants);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Update
// Update

exports.updateParticipantPayment = async (req, res) => {
  try {
    const { amount_paid } = req.body;
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.json({ error: "Participant not found" });

    participant.amount_paid = amount_paid;
    participant.balance = amount_paid - participant.amount_owed;
    await participant.save();

    res.json({ message: "Participant payment updated", participant });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Delete
// Delete

exports.deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.json({ error: "Participant not found" });

    await participant.deleteOne();

    const trip = await Trip.findById(participant.trip_id);
    if (trip) {
      trip.participants = trip.participants.filter(
        (p) => p.toString() !== participant.user_id.toString()
      );
      await trip.save();
    }

    res.json({ message: "Participant deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
