exports.setTarget = function(skill, actor, heroes, logs, combatLog, targets, target){
  switch(skill.target){
    case 'single':
      targets.push(target);
      combatLog = (actor.class.name + ' casted ' + skill.name + ' on ' + targets[0].class.name + '.');
      return combatLog;
    break;

    case 'self':
      targets.push(actor);
      combatLog = (actor.class.name + ' casted ' + skill.name + ' on himself.');
      return combatLog;
    break;

    case 'aoe':
      for (let i = 0 ; i < heroes.length ; i++){
        if (heroes[i].user_id != actor.user_id){
          targets.push(heroes[i]);
        };
      };
      combatLog = (actor.class.name + ' casted ' + skill.name + ' on enemy team.');
      return combatLog;
    break;

    case 'faoe':
      for (let i = 0 ; i < heroes.length ; i++){
        if (heroes[i].user_id == actor.user_id){
          targets.push(heroes[i]);
        };
      };
      combatLog = (actor.class.name + ' casted ' + skill.name + ' on ally team.');
      return combatLog;
    break
  };
}
