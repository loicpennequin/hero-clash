exports.resolveAction = function(heroes){
  heroes.forEach(function(hero, index){
    let actionData = {actor: hero , heroes: heroes},
        turn = resolveTurn(actionData);
    heroes = turn.heroes
    io.to(data.room).emit('actionResolved', turn);
  });
};

exports.dotCheck = function(actor, heroes, combatLog){
  if (actor.dotCounter){
    let dotOriginIndex = heroes.findIndex(item => item.id === actor.dotOrigin);
    skillAction.applyDot(heroes[actorIndex], combatLog)
  };
};

exports.hotCheck = function(actor, heroes, combatLog){
  if (actor.hotCounter){
    let hotOriginIndex = heroes.findIndex(item => item.id === actor.hotOrigin);
    skillAction.applyHot(heroes[actorIndex], combatLog)
  };
};

exports.attack = function(actor, target, combatLog){
  let dmg = actor.atk - target.def;

  if(dmg < 10){
    dmg = 10;
  };

  target.hp -= dmg;
  combatLog.push(actor.class.name + ' attacked ' + target.class.name + ', dealing ' + dmg + ' damage.');
  return {heroes: heroes, combatLog: combatLog};
};

exports.skill = function(actor, heroes, combatLog){
  let response = {},
      result = skillAction.skill(actor.skillAction, actor, heroes);
  result.combatLog.forEach(function(log, index){
    combatLog.push(log)
  });
  response.heroes = result.heroes;
  response.combatLog = combatLog;
  return response;
}

exports.defend = function(heroes, actor, actorIndex, combatLog){
  heroes[actorIndex].def += 20;
  combatLog.push(actor.class.name + ' defends, gaining 20 DEF for the turn.');
  let response = {heroes: heroes, combatLog: combatLog}
  return response;
}

exports.wait = function(heroes, actor, actorIndex, combatLog){
  heroes[actorIndex].mp += 10;
  if(heroes[actorIndex].mp > heroes[actorIndex].class.mana){
    heroes[actorIndex].mp = heroes[actorIndex].class.mana
  };
  combatLog.push(actor.class.name + ' waits, regaining 10 MP.');
  return {heroes: heroes, combatLog: combatLog}
}

exports.decreaseBuffCounter = function(hero, combatLog){
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
}

exports.decreaseDebuffCounter = function(hero, combatLog){
  if (hero.debuffCounter){
    hero.debuffCounter --;
    if (hero.debuffCounter <= 0){
      combatLog.push(hero.debuffOrigin + ' has ended on ' + hero.class.name + '.')
      delete hero.debuffCounter;
      delete hero.debuffOrigin;
      for (let i = 1 ; i <= 4 ; i++){
        hero[hero['debuff' + i + 'stat']] -= hero['debuff' + i + 'value'];
        delete hero['debuff' + i + 'stat'];
        delete hero['debuff' + i + 'value'];
      }
    }
  };
}
