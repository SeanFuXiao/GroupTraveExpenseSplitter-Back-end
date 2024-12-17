const express = require("express");
const router = express.Router();
const {
  addParticipant,
  getTripParticipants,
  getBillParticipants,
  deleteParticipant,
  deleteParticipantsByBillId,
} = require("../controllers/participantController");

router.post("/", addParticipant);
router.get("/trip/:trip_id", getTripParticipants);
router.get("/bill/:bill_id", getBillParticipants);
router.delete("/:id", deleteParticipant);
router.delete("/bill/:bill_id", deleteParticipantsByBillId);

module.exports = router;
