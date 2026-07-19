const { logCheckin, getCheckinHistory } = require("../models/checkinModel");


async function createCheckin(req,res){
  const {mood,stress,energy,note} = req.body;
  try {
    const checkin = await logCheckin(res.userId,{mood,stress,energy,note});
    res.status(201).json(checkin);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({message:"Could not save checkin"});
  }
}


async function listCheckins(req,res){
  try{
    const history = await getCheckinHistory(res.userId);
    res.json(history);

  }catch(err){
    console.error(err);
    res.status(500).json({message:"Could not fetch checkin history"});
  }
}

module.exports = {createCheckin,listCheckins};