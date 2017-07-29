module.exports = function(skill, actor, heroes, logs, combatLog, targets){

  combatLog = combatLog.slice(0, -1);
  combatLog += ', increasing'

  for (let i = 1 ; i <= 4 ; i++){
    if ( skill['buff' + i + 'value'] != null){
      let skillPower = Math.round(skill['buff' + i + 'value'] + (actor.matk * skill.statmodifierratio));
      combatLog += ' ' + (skill['buff' + i + 'stat'].toUpperCase()) + ' by ' + skillPower + ',';
      targets.forEach(function(target, index){
        let stat = skill['buff' + i + 'stat'];
        target[stat] += skillPower;
        target.buffCounter = skill.statmodifierduration;
        target.buffOrigin = skill.name;
        target['buff' + i + 'stat'] = skill['buff' + i + 'stat'];
        target['buff' + i + 'value'] = skillPower;
      });
    };
  };

  combatLog = combatLog.slice(0, -1);
  combatLog += '.'

  return combatLog;
};
