import type { Client } from "@line/bot-sdk";
import type { WebhookType } from "../type/line-type";

export const handleMessage = async (
  client: Client, 
  event: WebhookType
) => {
  try {
    console.log('message => ', event.message.text);

    return client.replyMessage(
      event.replyToken, 
      {
        type: 'text', 
        text: 'An administrator will respond at their earliest convenience.'
      }
    );
  }

  catch {
    return client.replyMessage(
      event.replyToken, 
      {
        type: 'text', 
        text: 'Some error'
      }
    ); 
  }
};