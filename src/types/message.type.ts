export interface PayloadBase {}

// payload types
export interface SelectorPayload extends PayloadBase {
  selector?: string
}

export interface SummarizationRequestPayload extends PayloadBase {
  request: {
    api: string
    model: string
  }
  iv: string;
  encryptedToken: string;
  objective: string
  instructions: string[]
}


// message
export interface TabMessage<Payload extends PayloadBase> {
  action: string;
  payload: Payload;
}
