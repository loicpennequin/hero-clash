exports.setDot = function(skill, actor, heroes, logs, combatLog, targets){

  let skillPower = skill.dotvalue + (actor.matk * skill.dotratio),
      damageDealt;

  for ( let i = 0 ; i < targets.length; i++){
    if (targets[i].mdef >= 0){
      damageDealt = Math.round(skillPower * ( 100 / (100 + targets[i].mdef)));
    } else {
      damageDealt = Math.round(skillPower * ( 2 - (100 / (100 - targets[i].mdef))));
    };

    targets[i].dotCounter = skill.dotduration;
    targets[i].dotOrigin = skill.name;
    targets[i].dotDmg = damageDealt;

    if ( targets[i].speed > actor.speed){
      applyDot(targets[i], logs);
    } else {

    };
  };

  return combatLog;
};

exports.applyDot = function(target, log){
  applyDot(target,log)
}

function applyDot(target, log){
  target.hp -= target.dotDmg;
  target.dotCounter--;
  log.push(target.class.name + ' is suffering from' + target.dotOrigin + ' and takes ' + target.dotDmg + ' damage.' );
  if (target.dotCounter <= 0){
    delete target.dotCounter;
    delete target.dotOrigin;
    delete target.dotDmg;
  };
};
