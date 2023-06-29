// Most likely wont be used here

export class NewTransactionEvent {
	queueName: string;
	destination: string;
	type: string;
	transaction: object;

	constructor({ destination, transactionJson} : {destination: string, transactionJson: {}}) {
		this.queueName = "transactions";
		this.destination = destination;
		this.type = "transaction";
		this.transaction = transactionJson;
	}

	serialize(): Buffer {
		return Buffer.from(
			JSON.stringify({
				queue_name: this.queueName,
				destination: this.destination,
				type: this.type,
				transaction: this.transaction,
			})
		);
	}
}
