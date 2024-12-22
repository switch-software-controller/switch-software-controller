import type { Message } from './message.ts';

export interface Channel {
  id: string;
  name: string;
  messages: Message[];

  clearMessages(): void;
  postMessage(message: Message): void;
}
