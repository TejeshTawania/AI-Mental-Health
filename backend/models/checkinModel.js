const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  stress:{
    type:Number,
    min:1,
    max:10,
  },
  energy:{
    type:Number,
    min:1,
    max:10,
  },
  sleep:{
    type:Number,
    min:0,
    max:24,
  },
  notes: {
    type: String,
  },
  date:{
    type:Date,
    default:Date.now(),
  },
  
},
);

const Checkin = mongoose.model("Checkin",checkinSchema);

async function logCheckin(userId,data){
  const checkin = new Checkin({ userId, ...data});
  await checkin.save();
  return checkin;
}

async function getCheckinHistory(userId,startDate,endDate) {
  return Checkin.find({userId}).sort({date:-1}).limit(30);  
}

module.exports = {logCheckin,getCheckinHistory};