export class MagicData {

  ID: number;
  resUrl: string;
  attack: number;
  attackRange: number;

 static resMap: { [ID: number]: MagicData; } = {
     1: { 
         ID: 1,
         resUrl: "animation/magic/magic_1",
         attack: 200,
         attackRange: 150,
     },
  };

}
