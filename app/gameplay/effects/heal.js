module.exports = function(skill, actor, heroes, logs, combatLog, targets){

  let skillPower = Math.round(skill.healvalue + (actor.matk * skill.healratio));

  combatLog = combatLog.slice(0, -1);
  combatLog += ', healing';
  for (let i = 0 ; i < targets.length ; i++){
    targets[i].hp += skillPower;
    if(targets[i].hp > targets[i].class.health){
      targets[i].hp = targets[i].class.health;
    }
    combatLog += ' ' +  targets[i].class.name + ' for ' + skillPower + ' HP,';
    if (i == targets.length){
      combatLog = combatLog.slice(0, -1);
      combatLog += '.';
    };
  };

  return combatLog;
};
