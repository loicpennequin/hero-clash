exports.trainingLoad = function(req,res){
    res.json({error: false, data: req.session.trainingGame});
}

exports.trainingSave = function(req, res){
  req.session.trainingGame = { game : req.body, state : true}
  res.json({error: false, data: {message : "game saved"}});
}

exports.mpLoad = function(req,res){
    res.json({error: false, data: req.session.MPGame});
}

exports.mpSave = function(req, res){
  req.session.mpGame = { game : req.body, state : true}
  res.json({error: false, data: {message : "game saved"}});
}
