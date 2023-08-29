
export class NewFiatDepositEvent {
    queueName: string;
    type: string;
    item: object;
    userId: string; 

    constructor(userId: string,item : {}){
    this.queueName = "payments";
    this.type = "stripe_deposit";
    this.item = item;
    this.userId = userId
      }
  
    serialize() : Buffer {
      return Buffer.from(JSON.stringify({
          queue_name: this.queueName,
          type: this.type,
          item : this.item,
          user_id : this.userId
        })
      );
    };
  }
  
//   stripe.checkout.sessions.create(
//     {
//         payment_method_types: ["card"],
//         mode: "payment",
//         line_items: [
//             {
//               price_data: {
//               currency: "usd",
//               product_data: {
//                   name: "Item name",
//               },
//               unit_amount: "price In Cents",
//               },
//               quantity: "items quantity",
//             }
//         ],
//         success_url: "url",
//         cancel_url: "url"
//     }
//   )