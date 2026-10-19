const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    appointmentDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Booked",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);