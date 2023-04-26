import config from "../config/config";
import * as amqp from "amqplib";
import { NewMessageEvent } from "./transaction";

const EVENT_QUEUE_NAME = "transactions";
const AMQPHOST = config.get("amqphost");
const AMQPPORT = config.get("amqpport");



const conn = await amqp.connect(
    `amqp://guest:guest@${AMQPHOST}:${AMQPPORT}`
);

const channel = await conn.createChannel();

await channel.assertQueue(EVENT_QUEUE_NAME);

export async function dispatchEvent(event : NewMessageEvent) {
  channel.sendToQueue(event.queueName, event.serialize(), {
    type: event.type,
  });
}
