'use strict';
let requireDir = require('require-dir'),
    effect = requireDir('./effects');

const SkillAction = function(skill, actor, heroes){
  this.skill = skill;
  this.heroes = heroes;
  this.actorIndex = this.heroes.findIndex(item => item.id === actor.id)
  this.actor = this.heroes[this.actorIndex];
  this.logs = [];
  this.combatLog = [];
  this.targets = [];
  this.targetIndex = this.heroes.findIndex(item => item.id === this.actor.target);
  this.target = this.heroes[this.targetIndex];
}

SkillAction.prototype.setTarget = function(){
  this.combatLog = effect.target.setTarget(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets, this.target)
};

SkillAction.prototype.buff = function(){
  this.combatLog = effect.buff(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.charm = function(){
  this.combatLog = effect.charm(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.damage = function(){
  this.combatLog = effect.damage(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.debuff = function(){
  this.combatLog = effect.debuff(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.disarm = function(){
  this.combatLog = effect.disarm(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.dot = function(){
  this.combatLog = effect.dot.setDot(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.heal = function(){
  this.combatLog = effect.heal(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
}

SkillAction.prototype.hot = function(){
  this.combatLog = effect.hot.setHot(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.lifesteal = function(){
    this.combatLog = effect.lifesteal(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.morph = function(){
    this.combatLog = effect.morph(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.protect = function(){
  this.combatLog = effect.protect(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.silence = function(){
  this.combatLog = effect.silence(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.stun = function(){
  this.combatLog = effect.stun(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.summon = function(){
    this.combatLog = effect.summon(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
};

SkillAction.prototype.taunt = function(){
  this.combatLog = effect.taunt(this.skill, this.actor, this.heroes, this.logs, this.combatLog, this.targets);
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

  action.targets.forEach(function(target, index){
    if (target.hp <= 0){
      if ( target.action != 'dead'){
        target.action = 'dead';
        action.logs.push(target.class.name + ' has been defeated!');
      };
    };
  })

  result = {heroes : action.heroes, combatLog : action.logs}
  return result;
}

exports.applyDot = function(target, log){
  effect.dot.applyDot(target, log);
};

exports.applyHot = function(target, log){
  effect.hot.applyHot(target, log);
};
