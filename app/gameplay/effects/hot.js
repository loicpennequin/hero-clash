module.exports = function(skill, actor, heroes, logs, combatLog, targets){

  let skillPower = skill.hotvalue + (actor.matk * skill.hotratio);

  for ( let i = 0 ; i < targets.length; i++){

    targets[i].hotCounter = skill.hotduration;
    targets[i].hotOrigin = skill.name;
    targets[i].hotHeal = skillPower;

    if ( targets[i].speed >= actor.speed){
      applyHot(targets[i], logs);
    };
  };
};


function applyHot(target, log){
  target.hp += target.hotHeal;
  if(target.hp > target.class.health){
    target.hp = target.class.health;
  };
  log.push(target.class.name + ' is healed for ' + target.hotDmg + ' by ' + target.hotOrigin + '.' );
  target.hotCounter--;
  if (target.hotCounter == 0){
    delete target.hotCounter;
    delete target.hotOrigin;
    delete target.hotHeal;
  };
};
