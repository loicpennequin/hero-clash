module.exports = function(skill, actor, heroes, logs, combatLog, targets){
  targets.forEach(function(target, index){
    target.protected = actor.id
  });
};
