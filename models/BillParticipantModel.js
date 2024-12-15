const mongoose = require('mongoose');

const BillParticipantSchema = new mongoose.Schema({
    bill_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true }, 
    participant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
    amount: { type: Number, required: true },
});

module.exports = mongoose.model('BillParticipant', BillParticipantSchema);