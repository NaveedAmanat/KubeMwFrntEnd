export class Utils{

    constructor(){
        
    }
    public findValueFromKey(key, array){
        if(array){
          for(let i=0; i<array.length; i++){
            if(array[i].codeKey == key){
              return array[i].codeValue;
            }
          }
        }
      }
}