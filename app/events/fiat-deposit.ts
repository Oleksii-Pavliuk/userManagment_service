
export class NewFiatStripeDepositEvent {
    queueName: string;
    type: string;
    amount: number;
    lineItems: object[];
    userId: string; 

    constructor(userId: string,lineItems : object[]){
    this.queueName = "stripeDeposits";
    this.type = "deposit";
    this.lineItems = lineItems;
    this.userId = userId
      }
  
    serialize() : Buffer {
      return Buffer.from(JSON.stringify({
          queue_name: this.queueName,
          type: this.type,
          lineItems : this.lineItems,
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