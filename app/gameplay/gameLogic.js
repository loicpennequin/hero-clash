let skillAction = require('./skillActions');


/*==================================DOT CHECK================================*/

function dotCheck(actor, actorIndex, heroes, combatLog){
  if (actor.dotCounter){
    let dotOriginIndex = heroes.findIndex(item => item.id === actor.dotOrigin);
    skillAction.applyDot(heroes[actorIndex], combatLog)
  };
};

/*==================================HOT CHECK================================*/

function hotCheck(actor, actorIndex, heroes, combatLog){
  if (actor.hotCounter){
    let hotOriginIndex = heroes.findIndex(item => item.id === actor.hotOrigin);
    skillAction.applyHot(heroes[actorIndex], combatLog)
  };
};

/*==================================ATTACK================================*/

function attack(heroes, actor, target, combatLog){
  let dmg,
  log = actor.class.name + ' attacked ' + target.class.name + '.'
  if (target.protected){
    let newTargetID = heroes.findIndex(item => item.id === target.protected),
        newTarget = heroes[newTargetID];
    target = newTarget;
    log = log.slice(0, -1);
    log += ', but ' + newTarget.class.name + ' protected him !';
    delete target['protected'];
  };
  if (target.def >= 0){
    dmg = Math.round(actor.atk * (100 / (100 + target.def)));
  }else{
    dmg = Math.round(actor.atk * (2 - (100 / (100 + target.def))));
  }

  target.hp -= dmg;
  log = log.slice(0, -1);
  log += ', dealing ' + dmg + ' damage.';
  combatLog.push(log);
  return {heroes: heroes, combatLog: combatLog};
};

/*==================================SKILL================================*/

function skill(actor, actorIndex, heroes, combatLog){
  let response = {},
      result = skillAction.skill(actor.skillAction, actor, heroes);
  result.combatLog.forEach(function(log, index){
    combatLog.push(log)
  });
  switch (heroes[actorIndex].skillAction.id){
    case heroes[actorIndex].skill1:
      heroes[actorIndex].activeSkill1.cdCounter = actor.skillAction.cooldown;
    break
    case heroes[actorIndex].skill2:
      heroes[actorIndex].activeSkill2.cdCounter = actor.skillAction.cooldown;
    break
    case heroes[actorIndex].skill3:
      heroes[actorIndex].activeSkill3.cdCounter = actor.skillAction.cooldown;
    break
    case heroes[actorIndex].skill4:
      heroes[actorIndex].activeSkill4.cdCounter = actor.skillAction.cooldown;
    break
  };
  response.heroes = result.heroes;
  response.combatLog = combatLog;
  return response;
};

/*==================================DEFEND================================*/

function defend(heroes, actor, actorIndex, combatLog){
  heroes[actorIndex].def += 20;
  combatLog.push(actor.class.name + ' defends, gaining 20 DEF for the turn.');
  let response = {heroes: heroes, combatLog: combatLog}
  return response;
};

/*==================================WAIT================================*/

function wait(heroes, actor, actorIndex, combatLog){
  heroes[actorIndex].mp += 10;
  if(heroes[actorIndex].mp > heroes[actorIndex].class.mana){
    heroes[actorIndex].mp = heroes[actorIndex].class.mana
  };
  combatLog.push(actor.class.name + ' waits, regaining 10 MP.');
  return {heroes: heroes, combatLog: combatLog}
};

/*=============================DECREASE BUFF COUNTER==========================*/

function decreaseBuffCounter(hero, combatLog){
  if (hero.buffCounter){
    hero.buffCounter --;
    if (hero.buffCounter <= 0){
      combatLog.push(hero.buffOrigin + ' has ended on ' + hero.class.name + '.')
      delete hero.buffCounter;
      delete hero.buffOrigin;
      for (let i = 1 ; i <= 4 ; i++){
        hero[hero['buff' + i + 'stat']] -= hero['buff' + i + 'value'];
        delete hero['buff' + i + 'stat'];
        delete hero['buff' + i + 'value'];
      }
    }
  };
};

/*=============================DECREASE DEBUFF COUNTER==========================*/

function decreaseDebuffCounter(hero, combatLog){
  if (hero.debuffCounter){
    hero.debuffCounter --;
    if (hero.debuffCounter <= 0){
      combatLog.push(hero.debuffOrigin + ' has ended on ' + hero.class.name + '.')
      delete hero.debuffCounter;
      delete hero.debuffOrigin;
      for (let i = 1 ; i <= 4 ; i++){
        hero[hero['debuff' + i + 'stat']] += hero['debuff' + i + 'value'];
        delete hero['debuff' + i + 'stat'];
        delete hero['debuff' + i + 'value'];
      }
    }
  };
};

/*============================RESOLVE TURN========================================*/

function resolveTurn(data){
  let combatLog = [],
      heroes = data.heroes,
      actor = data.actor,
      actorIndex = heroes.findIndex(item => item.id === actor.id),
      response = {},
      targetIndex = heroes.findIndex(item => item.id === data.actor.target),
      target = heroes[targetIndex],
      skillAction = require('./skillActions');


  dotCheck(actor, actorIndex, heroes, combatLog);
  hotCheck(actor, actorIndex, heroes, combatLog);

  switch (actor.action){
    case 'attack':
        response = attack(heroes, actor, target, combatLog);
      break;
    case 'skill':
        response = skill(actor, actorIndex, heroes, combatLog);
      break;
    case 'defend' :
        response = defend(heroes, actor, actorIndex, combatLog);
      break;
    case 'wait' :
        response =  wait(heroes, actor, actorIndex, combatLog);
      break;
  };

  return response
};


/*=================================END TURN=======================================*/

function endTurn(data){
  let combatLog = [],
      heroes = data.heroes,
      heroesCopy = data.heroes.slice(0),
      response;

  heroesCopy.forEach(function(hero, key){
    decreaseBuffCounter(hero, combatLog);
    decreaseDebuffCounter(hero, combatLog);

    //remove dead heroes
    if (hero.hp <= 0){
      let index = heroesCopy.indexOf(hero);
      heroes.splice(index, 1);
      combatLog.push(hero.class.name + ' has been defeated!')
    } else {
      //remove 'defend' buff
      if(hero.action === 'defend'){
        hero.def -= 20;
      }
    };
  });

  //decrease all cooldown counters
  heroes.forEach(function(hero, index){
    for (let i = 1; i <= 4 ; i++){
      let skill = hero['activeSkill' + i];
      if (skill){
        if(skill.cdCounter){
          skill.cdCounter--;
          if(skill.cdCounter <= 0){
            delete skill.cdCounter;
          };
        };
      };
    };
  });

  combatLog.push('--------End of the Turn---------');

  response = {heroes: heroes, combatLog: combatLog};

  return response
};



/*===============================EXPORTS ==================================*/

exports.resolveAction = function(heroes, hero){
  let actionData = {actor: hero , heroes: heroes},
  turn = resolveTurn(actionData);
  heroes = turn.heroes

  return turn
};

exports.dotCheck = function(actor, actorIndex, heroes, combatLog){
  dotCheck(actor, heroes, combatLog);
};

exports.hotCheck = function(actor, actorIndex, heroes, combatLog){
  hotCheck(actor, heroes, combatLog);
};

exports.skill = function(actor, actorIndex, heroes, combatLog){
  skill(actor, actorIndex, heroes, combatLog);
};

exports.attack = function(heroes, actor, target, combatLog){
  attack(heroes, actor, target, combatLog);
};

exports.defend = function(heroes, actor, actorIndex, combatLog){
  defend(heroes,actor, actorIndex, combatLog);
};

exports.wait = function(heroes, actor, actorIndex, combatLog){
  wait(heroes, actor, actorIndex, combatLog);
};

exports.decreaseBuffCounter = function(hero, combatLog){
  decreaseBuffCounter(hero, combatLog);
};

exports.decreaseDebuffCounter = function(hero, combatLog){
  decreaseBuffCounter(hero, combatLog);
};

exports.resolveTurn = function(data){
  return resolveTurn(data);
}

exports.endTurn = function(data){
  return endTurn(data);
}
