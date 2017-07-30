module.exports = function(skill, actor, heroes, logs, combatLog, targets){
  let skillPower = skill.damagevalue + (actor.matk * skill.damageratio),
      damageDealt, totalDamage;

  combatLog = combatLog.slice(0, -1);
  combatLog += ', dealing';
  for (let i = 0 ; i < targets.length ; i++){
    if (targets[i].mdef >= 0){
      damageDealt = Math.round(skillPower * ( 100 / (100 + targets[i].mdef)));
    } else {
      damageDealt = Math.round(skillPower * ( 2 - (100 / (100 - targets[i].mdef))));
    }
    totalDamage =+ damageDealt;
    targets[i].hp -= damageDealt;
    combatLog += ' ' + damageDealt + ' damage to ' + targets[i].class.name + ',';
    if (i == targets.length){
      combatLog = combatLog.slice(0, -1);
      combatLog += '.';
    };
  };

  actor.hp += (totalDamage * skill.healratio)
  if(actor.hp > actor.class.health){
    actor.hp = actor.class.health;
  }

  combatLog = combatLog.slice(0, -1);
  combatLog += 'and healing for ' + totalDamage*skill.healratio + ' HP.'

  return combatLog;
};
