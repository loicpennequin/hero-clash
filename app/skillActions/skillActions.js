const SkillAction = function(skill, actor, heroes){
  this.skill = skill;
  this.actor = actor;
  this.heroes = heroes;
  this.combatLog = "";
  this.targets = [];
}

SkillAction.prototype.setTarget = function(){
  switch(this.skill.target){
    case 'single':
      this.targets.push(this.actor.target);
      this.actor.target = this.targets;
      this.combatLog = (this.actor.class.name + ' casted ' + this.skill.name + ' on ' + this.targets[0].class.name + '.');
    break;

    case 'self':
      this.targets.push(this.actor);
      this.actor.target = this.targets;
      this.combatLog = (this.actor.class.name + ' casted ' + this.skill.name + ' on himself.');
    break;

    case 'aoe':
      this.heroes.forEach(function(hero, index){
        if (hero.user_id != actor.user_id){
          this.targets.push(hero);
        };
      });
      this.actor.target = targets;
      this.combatLog = (this.actor.class.name + ' casted ' + this.skill.name + ' on enemy team');
    break;

    case 'faoe':
      this.heroes.forEach(function(hero, index){
        if (hero.user_id == actor.user_id){
          targets.push(hero);
        };
      });
      this.actor.target = targets;
      this.combatLog = (this.actor.class.name + ' casted ' + this.skill.name + ' on ally team');
    break
  };
};

SkillAction.prototype.damage = function(){
  let skillPower = this.skill.damagevalue + (this.actor.matk * this.skill.damageratio);
  this.combatLog = this.combatLog.slice(0, -1);
  this.combatLog += ', dealing';
  for (let i = 0 ; i < this.targets.length ; i++){
    let tIndex = this.heroes.findIndex(item => item.id === this.targets[i].id),
    damageDealt = skillPower - this.targets[i].mdef;
    this.heroes[tIndex].hp -= damageDealt;
    this.combatLog += ' ' + damageDealt + ' to ' + this.targets[i].class.name + ',';
    if (i == this.targets.length){
      this.combatLog = this.combatLog.slice(0, -1);
      this.combatLog += '.';
    };
  };
}

SkillAction.prototype.heal = function(){
  let skillPower = this.skill.damagevalue + (this.actor.matk * this.skill.healratio);
  this.combatLog = this.combatLog.slice(0, -1);
  this.combatLog += ', healing';
  for (let i = 0 ; i < this.targets.length ; i++){
    let tIndex = this.heroes.findIndex(item => item.id === this.targets[i].id),
    this.heroes[tIndex].hp += skillPower;
    this.combatLog += ' ' this.targets[i].class.name + ' for ' + skillPower + ' HP,';
    if (i == this.targets.length){
      this.combatLog = this.combatLog.slice(0, -1);
      this.combatLog += '.';
    };
  };
}

exports.skill = function(skill, actor, heroes){
  let action = new SkillAction(skill, actor, heroes),
      effects = action.skill.effects.split(" "),
      result;

  //check mana
  if(action.actor.mp < action.skill.cost){
    action.combatLog = (action.actor.class.name + ' tried to use ' + action.skill.name + ", but he doesn't have enough mana !" )
  }else{
    //consume mana
    let actorIndex = action.heroes.findIndex(item => item.id === action.actor.id);
    action.heroes[actorIndex].mp -= action.skill.cost;

    //set target(s)
    action.setTarget();

    //apply skill effects for each target
    effects.forEach(function(effect, index){
        switch(effect){
          case 'damage' :
            action.damage();
          break
        };
    });
  };

  result = {heroes : action.heroes, combatLog : action.combatLog}
  return result;
}
