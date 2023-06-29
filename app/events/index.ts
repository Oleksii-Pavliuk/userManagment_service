import config from "../config/config";
import * as amqp from "amqplib";
import { NewTransactionEvent } from "../models/transaction";
import { NewFiatDepositEvent } from "../models/fiat-deposit";

const EVENT_QUEUE_NAME = "payments";
const AMQPHOST = config.get("amqphost");
const AMQPPORT = config.get("amqpport");



export async function dispatchEvent(
	event: NewTransactionEvent | NewFiatDepositEvent
): Promise<string> {


		// connect
	const conn = await amqp.connect(`amqp://guest:guest@${AMQPHOST}:${AMQPPORT}`);

	// create channel
	const channel = await conn.createChannel();

	// create send queue
	const queue = await channel.assertQueue(EVENT_QUEUE_NAME);
  
	return new Promise<string>(async (resolve, reject) => {
		// create response queue
		const responseQueue = await channel.assertQueue("", { exclusive: true });

		// genereate responce id
		let correlationId = generateUuid();

		let clientSecret;

		channel.consume(
			responseQueue.queue,
			(msg) => {
				if (msg) {
					if (msg.properties.correlationId == correlationId) {
						clientSecret = JSON.parse(msg.content.toString());
						resolve(clientSecret);
					}
				}
			},
			{
				noAck: true,
			}
		);

		channel.sendToQueue(queue.queue, event.serialize(), {
			type: event.type,
		});
	});
}
function generateUuid() {
	return (
		Math.random().toString() +
		Math.random().toString() +
		Math.random().toString()
	);
}
