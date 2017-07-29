module.exports = function(skill, actor, heroes, logs, combatLog, targets){
  combatLog = combatLog.slice(0, -1);
  combatLog += ', protecting ';
  targets.forEach(function(target, index){
    target.protected = actor.id
    combatLog += target.class.name + '.';
  });

  return combatLog;
};
