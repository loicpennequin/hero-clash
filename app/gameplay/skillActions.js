'use strict';
let requireDir = require('require-dir'),
    effect = requireDir('./effects');

const SkillAction = function(skill, actor, heroes){
  let that = this;
  that.skill = skill;
  that.actor = actor;
  that.heroes = heroes;
  that.logs = [];
  that.combatLog = [];
  that.targets = [];
  that.targetIndex = that.heroes.findIndex(item => item.id === that.actor.target);
  that.target = that.heroes[that.targetIndex];
}

SkillAction.prototype.setTarget = function(){
  let that = this;

  switch(that.skill.target){
    case 'single':
      that.targets.push(that.target);
      that.combatLog = (that.actor.class.name + ' casted ' + that.skill.name + ' on ' + that.targets[0].class.name + '.');
    break;

    case 'self':
      that.targets.push(that.actor);
      that.combatLog = (that.actor.class.name + ' casted ' + that.skill.name + ' on himself.');
    break;

    case 'aoe':
      for (let i = 0 ; i < that.heroes.length ; i++){
        if (that.heroes[i].user_id != that.actor.user_id){
          that.targets.push(that.heroes[i]);
        };
      };
      that.combatLog = (that.actor.class.name + ' casted ' + that.skill.name + ' on enemy team.');

    break;

    case 'faoe':
      for (let i = 0 ; i < that.heroes.length ; i++){
        if (that.heroes[i].user_id == that.actor.user_id){
          that.targets.push(that.heroes[i]);
        };
      };
      that.combatLog = (that.actor.class.name + ' casted ' + that.skill.name + ' on ally team.');
    break
  };
};

SkillAction.prototype.damage = function(){
  effect.damage(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.heal = function(){
  effect.heal(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
}

SkillAction.prototype.dot = function(){
  effect.dot(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.hot = function(){
  effect.hot(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.buff = function(){
  effect.buff(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.debuff = function(){
  effect.debuff(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.protect = function(){
  effect.protect(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.taunt = function(){
  that.targets.forEach(function(target, index){
    target.taunted = that.actor.id
  });
};

SkillAction.prototype.silence = function(){

};

SkillAction.prototype.stun = function(){

};

SkillAction.prototype.lifesteal = function(){

};

SkillAction.prototype.morph = function(){

};

SkillAction.prototype.summon = function(){

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

    // apply skill effects
    effects.forEach(function(effect, index){
      action[effect]();
    })
  };
  action.logs.push(action.combatLog)
  result = {heroes : action.heroes, combatLog : action.logs}
  return result;
}

exports.applyDot = function(skill, actor, target, log){
  applyDot(skill, actor, target, log);
};

exports.applyHot = function(skill, actor, target, log){
  applyHot(skill, actor, target, log);
};

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
