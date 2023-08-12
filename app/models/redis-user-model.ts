import { Schema } from 'redis-om'

export interface AbstractUser{
  id: number;
  level: 0 | 1 | 2;
  balance: number;
  ETH: number;
  wallets: string[];
}

export const abstractUserSchema = new Schema('AbstractUser',{
  id: {
    type: "string"
    //ID of user(shared between all databases)
  },
  level:{
    type: "string"
    //Level of access(KYC): 0(email,password); 1(user model data); 2(KYC model data)
  },
  balance: {
    type: "number"
    //Fiat balance
  },
  ETH: {
    type: "number"
    
    //ETH balance
  },
  wallets: {
    type: "string[]"
    //Wallets
  }
}, {
  dataStructure: 'JSON'
})
