import { Request } from 'express';

export interface WebhookType {
  type: string,
  message: { 
    type: string, 
    id: string, 
    text: string 
  }
  webhookEventId: string,
  deliveryContext: { isRedelivery: boolean },
  timestamp: number,
  source: { 
    type: 'user' | 'group' | 'room', 
    userId: string 
  },
  replyToken: string,
  mode: 'active'
}

export interface Profile {
  userId: string,
  displayName: string,
  pictureUrl: string,
  statusMessage: string,
  language:string
}

export interface CustomRequest<B, P extends Request['params']> extends Request {
  body: B,
  params: P
}