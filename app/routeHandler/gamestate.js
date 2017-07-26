exports.load = function(req,res){
    res.json({error: false, data: req.session.game});
}

exports.save = function(req, res){
  req.session.game = { game : req.body, state : true}
  res.json({error: false, data: {message : "game saved"}});
}
