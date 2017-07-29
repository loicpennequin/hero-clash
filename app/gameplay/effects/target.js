exports.setTarget = function(skill, actor, heroes, logs, combatLog, targets, target){
  switch(skill.target){
    case 'single':
      return single(skill, actor, heroes, logs, combatLog, targets, target);
    break;

    case 'self':
      return self(skill, actor, heroes, logs, combatLog, targets, target);
    break;

    case 'aoe':
      return aoe(skill, actor, heroes, logs, combatLog, targets, target);
    break;

    case 'faoe':
      return faoe(skill, actor, heroes, logs, combatLog, targets, target);
    break
  };
};


function single(skill, actor, heroes, logs, combatLog, targets, target){
  combatLog = (actor.class.name + ' casted ' + skill.name + ' on ' + target.class.name + '.');
  if (target.protected){
    let newTargetID = heroes.findIndex(item => item.id === target.protected),
        newTarget = heroes[newTargetID];
    targets.push(newTarget);
    combatLog = combatLog.slice(0, -1);
    combatLog += ', but ' + newTarget.class.name + ' protected him !';
    delete target['protected'];
  } else {
    targets.push(target);
  };
  return combatLog;
};

function self(skill, actor, heroes, logs, combatLog, targets, target){
  targets.push(actor);
  combatLog = (actor.class.name + ' casted ' + skill.name + ' on himself.');
  return combatLog;
};

function aoe(skill, actor, heroes, logs, combatLog, targets, target){
  for (let i = 0 ; i < heroes.length ; i++){
    if (heroes[i].user_id != actor.user_id){
      targets.push(heroes[i]);
    };
  };
  combatLog = (actor.class.name + ' casted ' + skill.name + ' on enemy team.');
  return combatLog;
};

function faoe(skill, actor, heroes, logs, combatLog, targets, target){
  for (let i = 0 ; i < heroes.length ; i++){
    if (heroes[i].user_id == actor.user_id){
      targets.push(heroes[i]);
    };
  };
  combatLog = (actor.class.name + ' casted ' + skill.name + ' on ally team.');
  return combatLog;
};
