exports.trainingLoad = function(req,res){
    res.json({error: false, data: req.session.user.trainingGame});
}

exports.trainingSave = function(req, res){
  req.session.user.trainingGame = { game : req.body, state : true}
  res.json({error: false, data: {message : "game saved"}});
}

exports.mpLoad = function(req,res){
    res.json({error: false, data: req.session.user.MPGame});
}

exports.mpSave = function(req, res){
  req.session.user.MPGame = { game : req.body.game, state : true, room : req.body.room}
  res.json({error: false, data: req.session.user.MPGame});
}
