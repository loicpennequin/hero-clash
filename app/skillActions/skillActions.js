'use strict';

const SkillAction = function(skill, actor, heroes){
  let that = this;
  that.skill = skill;
  that.actor = actor;
  that.heroes = heroes;
  that.logs = [];
  that.combatLog = [];
  that.targets = [];
}

SkillAction.prototype.setTarget = function(){
  let that = this;

  switch(that.skill.target){
    case 'single':
      that.targets.push(that.actor.target);
      that.actor.target = that.targets;
      that.combatLog = (that.actor.class.name + ' casted ' + that.skill.name + ' on ' + that.targets[0].class.name + '.');
    break;

    case 'self':
      that.targets.push(that.actor);
      that.actor.target = that.targets;
      that.combatLog = (that.actor.class.name + ' casted ' + that.skill.name + ' on himself.');
    break;

    case 'aoe':
      for (let i = 0 ; i < that.heroes.length ; i++){
        if (that.heroes[i].user_id != that.actor.user_id){
          that.targets.push(that.heroes[i]);
        };
      };
      that.actor.target = that.targets;
      that.combatLog = (that.actor.class.name + ' casted ' + that.skill.name + ' on enemy team');

    break;

    case 'faoe':
      for (let i = 0 ; i < that.heroes.length ; i++){
        if (that.heroes[i].user_id == that.actor.user_id){
          that.targets.push(that.heroes[i]);
        };
      };
      that.actor.target = that.targets;
      that.combatLog = (that.actor.class.name + ' casted ' + that.skill.name + ' on ally team');
    break
  };
};

SkillAction.prototype.damage = function(){
  let that = this;

  let skillPower = that.skill.damagevalue + (that.actor.matk * that.skill.damageratio);
  that.combatLog = that.combatLog.slice(0, -1);
  that.combatLog += ', dealing';
  for (let i = 0 ; i < that.targets.length ; i++){
    let tIndex = that.heroes.findIndex(item => item.id === that.targets[i].id),
    damageDealt = skillPower - that.targets[i].mdef;
    that.heroes[tIndex].hp -= damageDealt;
    that.combatLog += ' ' + damageDealt + ' to ' + that.targets[i].class.name + ',';
    if (i == that.targets.length){
      that.combatLog = that.combatLog.slice(0, -1);
      that.combatLog += '.';
    };
  };
};

SkillAction.prototype.heal = function(){
  let that = this;

  let skillPower = that.skill.healvalue + (that.actor.matk * that.skill.healratio);
  that.combatLog = that.combatLog.slice(0, -1);
  that.combatLog += ', healing';
  for (let i = 0 ; i < that.targets.length ; i++){
    let tIndex = that.heroes.findIndex(item => item.id === that.targets[i].id);
    that.heroes[tIndex].hp += skillPower;
    that.combatLog += ' ' +  that.targets[i].class.name + ' for ' + skillPower + ' HP,';
    if (i == that.targets.length){
      that.combatLog = that.combatLog.slice(0, -1);
      that.combatLog += '.';
    };
  };
}

SkillAction.prototype.dot = function(){
  let that = this;
  for ( let i = 0 ; i < that.targets.length; i++){
    that.targets[i].dotCounter = that.skill.dotduration;
    if ( that.targets[i].speed > that.actor.speed){
      applyDot(that.skill, that.actor, that.targets[i], that.logs);
    };
  };
};

exports.skill = function(skill, actor, heroes){
  let action = new SkillAction(skill, actor, heroes),
      effects = action.skill.effects.split(" "),
      result;

  //check mana
  if(action.actor.mp < action.skill.cost){
    action.combatLog = (action.actor.class.name + ' tried to use ' + action.skill.name + ", but he didn't have enough mana !" )
  }else{
    //consume mana
    let actorIndex = action.heroes.findIndex(item => item.id === action.actor.id);
    action.heroes[actorIndex].mp -= action.skill.cost;

    //set target(s)
    action.setTarget();

    //apply skill effects
    effects.forEach(function(effect, index){
        switch(effect){
          case 'damage' :
            action.damage();
          break

          case 'heal' :
            action.heal();
          break

          case 'dot' :
            action.dot();
          break
        };
    });
  };
  action.logs.push(action.combatLog)
  result = {heroes : action.heroes, combatLog : action.logs}
  return result;
}

exports.applyDot = function(skill, actor, target, log){
  applyDot(skill, actor, target, log);
};

function applyDot(skill, actor, target, log){
  let damageDealt;
  if (skill){
    let skillPower = skill.dotvalue + (actor.matk * skill.dotratio);
    damageDealt = skillPower - (target.mdef / 2);
    if ( damageDealt < 10){
      damageDealt = 10;
    };
    target.dotOrigin = skill.name;
    target.dotDmg = damageDealt;
  }else if (skill == false){
    skill = {};
    skill.name = target.dotOrigin;
    damageDealt = target.dotDmg;
  }
  target.hp -= damageDealt;
  target.dotCounter--;
  if (target.dotCounter == 0){
    delete target.dotCounter;
    delete target.dotOrigin;
    delete target.dotDmg;
  };
  log.push(target.class.name + ' is suffering from' + skill.name + ' and takes ' + damageDealt + ' damage.' );
}
