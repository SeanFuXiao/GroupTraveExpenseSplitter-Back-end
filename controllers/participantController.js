const Participant = require("../models/ParticipantModel");

// Create
// Create

exports.addParticipant = async (req, res) => {
  try {
    const { trip_id, bill_id, user_id, amount_paid, amount_owed } = req.body;

    if (!trip_id || !user_id) {
      return res.json({ error: "Trip ID and User ID required" });
    }

    const participant = new Participant({
      trip_id,
      bill_id,
      user_id,
      amount_paid,
      amount_owed,
    });

    await participant.save();
    res.json({ message: "Participant added", participant });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get
// Get
exports.getTripParticipants = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const participants = await Participant.find({ trip_id }).populate(
      "user_id",
      "username"
    );
    res.json(participants);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get by bill
// Get by bill

exports.getBillParticipants = async (req, res) => {
  try {
    const { bill_id } = req.params;
    const participants = await Participant.find({ bill_id }).populate(
      "user_id",
      "username"
    );
    res.json(participants);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Delete by id
// Delete by id

exports.deleteParticipant = async (req, res) => {
  try {
    const deletedParticipant = await Participant.findByIdAndDelete(
      req.params.id
    );
    if (!deletedParticipant) {
      return res.json({ error: "Participant not found" });
    }
    res.json({ message: "Participant deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// delete by bill id
// delete by bill id

exports.deleteParticipantsByBillId = async (req, res) => {
  try {
    const { bill_id } = req.params;

    const result = await Participant.deleteMany({ bill_id });

    if (result.deletedCount === 0) {
      return res.json({ error: "No participants found" });
    }

    res.json({
      message: "Participants deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};
