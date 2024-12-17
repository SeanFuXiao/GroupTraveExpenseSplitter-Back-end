const Trip = require("../models/TripModel");

// Create
// Create
exports.createTrip = async (req, res) => {
  try {
    const { user_id, name, start_date, end_date, total_cost } = req.body;

    if (!user_id || !name || !start_date || !end_date) {
      return res.json({ error: "All fields except total_cost are required" });
    }

    const trip = new Trip({ user_id, name, start_date, end_date, total_cost });
    await trip.save();

    res.json({ message: "Trip created", trip });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get all
// Get all

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get by ID
// Get by ID

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.json({ error: "Trip not found" });

    res.json(trip);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Update
// Update

exports.updateTrip = async (req, res) => {
  try {
    const { name, start_date, end_date, total_cost } = req.body;

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { name, start_date, end_date, total_cost },
      { new: true, runValidators: true }
    );

    if (!updatedTrip) return res.status(404).json({ error: "Trip not found" });

    res.json({ message: "Trip updated successfully", updatedTrip });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Delete
// Delete

exports.deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) return res.json({ error: "Trip not found" });

    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
