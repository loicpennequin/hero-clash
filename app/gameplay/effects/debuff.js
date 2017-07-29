module.exports = function(skill, actor, heroes, logs, combatLog, targets){

  combatLog = combatLog.slice(0, -1);
  combatLog += ', decreasing'

  for (let i = 1 ; i <= 4 ; i++){
    if ( skill['debuff' + i + 'value'] != null){
      let skillPower = Math.round(skill['debuff' + i + 'value'] + (actor.matk * skill.statmodifierratio));
      combatLog += ' ' + (skill['debuff' + i + 'stat'].toUpperCase()) + ' by ' + skillPower + ',';
      targets.forEach(function(target, index){
        let stat = skill['debuff' + i + 'stat'];

        target[stat] -= skillPower;
        target.debuffCounter = skill.statmodifierduration;
        target.debuffOrigin = skill.name;
        target['debuff' + i + 'stat'] = skill['debuff' + i + 'stat'];
        target['debuff' + i + 'value'] = skillPower;
      });
    };
  };

  combatLog = combatLog.slice(0, -1);
  combatLog += '.'

  return combatLog;
};
