module.exports = function(skill, actor, heroes, logs, combatLog, targets){

  let skillPower = skill.healvalue + (actor.matk * skill.healratio);

  combatLog = combatLog.slice(0, -1);
  combatLog += ', healing';
  for (let i = 0 ; i < targets.length ; i++){
    targets[i].hp += skillPower;
    combatLog += ' ' +  targets[i].class.name + ' for ' + skillPower + ' HP,';
    if (i == targets.length){
      combatLog = combatLog.slice(0, -1);
      combatLog += '.';
    };
  };

  return combatLog;
};
