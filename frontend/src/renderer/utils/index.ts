export type MessageType = 'question' | 'answer'




export interface Message {
    question: string,
    answer: string,
    metadata: object
  }