
export class NewMessageEvent {
    queueName: string;
    destination : string;
    type: string;
    transaction: object;
  
    constructor({destination,
      type,transaction}){
    this.queueName = "transactions";
    this.destination = destination;
    this.type = type;
    this.transaction = transaction
      }
  
    serialize() : Buffer {
      return Buffer.from(JSON.stringify({
          queue_name: this.queueName,
          destination: this.destination,
          type: this.type,
          transaction : this.transaction
        })
      );
    };
  }
  
  