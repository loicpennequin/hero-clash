'use strict';

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
  let that = this,
      skillPower = that.skill.damagevalue + (that.actor.matk * that.skill.damageratio),
      damageDealt;

  that.combatLog = that.combatLog.slice(0, -1);
  that.combatLog += ', dealing';
  for (let i = 0 ; i < that.targets.length ; i++){
    if (that.targets[i].mdef >= 0){
      damageDealt = skillPower * ( 100 / (100 + that.targets[i].mdef));
    } else {
      damageDealt = skillPower * ( 2 - (100 / (100 - that.targets[i].mdef)));
    }
    that.targets[i].hp -= damageDealt;
    that.combatLog += ' ' + damageDealt + ' damage to ' + that.targets[i].class.name + ',';
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
  let that = this,
      skillPower = that.skill.dotvalue + (that.actor.matk * that.skill.dotratio);
      damageDealt;

  for ( let i = 0 ; i < that.targets.length; i++){
    if (that.targets[i].mdef >= 0){
      damageDealt = skillPower * ( 100 / (100 + that.targets[i].mdef));
    } else {
      damageDealt = skillPower * ( 2 - (100 / (100 - that.targets[i].mdef)));
    };
    
    that.targets[i].dotCounter = that.skill.dotduration;
    that.targets[i].dotOrigin = that.skill.name;
    that.targets[i].dotDmg = damageDealt;

    if ( that.targets[i].speed > that.actor.speed){
      applyDot(that.targets[i], that.logs);
    } else {

    };
  };
};

SkillAction.prototype.hot = function(){
  let that = this;
  for ( let i = 0 ; i < that.targets.length; i++){
    let skillPower = that.skill.hotvalue + (that.actor.matk * that.skill.hotratio),
        damageHealed  = skillPower;

    that.targets[i].hotCounter = that.skill.hotduration;
    that.targets[i].hotOrigin = that.skill.name;
    that.targets[i].hotHeal = damageHealed;

    if ( that.targets[i].speed >= that.actor.speed){
      applyHot(that.targets[i], that.logs);
    };
  };
};

SkillAction.prototype.buff = function(){
  let that = this;
  that.combatLog = that.combatLog.slice(0, -1);
  that.combatLog += ', increasing'

  for (let i = 1 ; i <= 4 ; i++){
    if ( that.skill['buff' + i + 'value'] != null){
      let skillPower = that.skill['buff' + i + 'value'] + (that.actor.matk * that.skill.statmodifierratio);
      that.combatLog += ' ' + (that.skill['buff' + i + 'stat'].toUpperCase()) + ' by ' + skillPower + ',';
      that.targets.forEach(function(target, index){
        let stat = that.skill['buff' + i + 'stat'],
            targetIndex = that.heroes.findIndex(item => item.id === target.id);
        that.heroes[targetIndex][stat] += skillPower;
        that.heroes[targetIndex].buffCounter = that.skill.statmodifierduration;
        that.heroes[targetIndex].buffOrigin = that.skill.name;
        that.heroes[targetIndex]['buff' + i + 'stat'] = that.skill['buff' + i + 'stat'];
        that.heroes[targetIndex]['buff' + i + 'value'] = skillPower;
      });
    };
  };

  that.combatLog = that.combatLog.slice(0, -1);
  that.combatLog += '.'
};

SkillAction.prototype.debuff = function(){
  let that = this;
  that.combatLog = that.combatLog.slice(0, -1);
  that.combatLog += ', decreasing'

  for (let i = 1 ; i <= 4 ; i++){
    if ( that.skill['debuff' + i + 'value'] != null){
      let skillPower = that.skill['debuff' + i + 'value'] + (that.actor.matk * that.skill.statmodifierratio);
      that.combatLog += ' ' + (that.skill['debuff' + i + 'stat'].toUpperCase()) + ' by ' + skillPower + ',';
      that.targets.forEach(function(target, index){
        let stat = that.skill['debuff' + i + 'stat'],
            targetIndex = that.heroes.findIndex(item => item.id === target.id);
        that.heroes[targetIndex][stat] -= skillPower;
        that.heroes[targetIndex].debuffCounter = that.skill.statmodifierduration;
        that.heroes[targetIndex].debuffOrigin = that.skill.name;
        that.heroes[targetIndex]['debuff' + i + 'stat'] = that.skill['debuff' + i + 'stat'];
        that.heroes[targetIndex]['debuff' + i + 'value'] = skillPower;
      });
    };
  };

  that.combatLog = that.combatLog.slice(0, -1);
  that.combatLog += '.'
};

SkillAction.prototype.protect = function(){

};

SkillAction.prototype.taunt = function(){

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
