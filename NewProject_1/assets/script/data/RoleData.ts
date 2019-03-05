export class RoleData {

  ID: number;
  resUrl: string;
  maxHp: number;
  attack: number;
  attackRange: number;
  attackSpeed: number;
  moveRange: number;

 static resMap: { [ID: number]: RoleData; } = {
     1: { 
         ID: 1,
         resUrl: "model/role/character_1",
         maxHp: 400,
         attack: 200,
         attackRange: 150,
         attackSpeed: 1.5,
         moveRange: 150,
     },
     2: { 
         ID: 2,
         resUrl: "model/role/creature_1",
         maxHp: 200,
         attack: 50,
         attackRange: 100,
         attackSpeed: 2,
         moveRange: 100,
     },
  };

}
