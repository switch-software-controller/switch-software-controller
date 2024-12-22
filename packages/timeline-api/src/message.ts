export interface Message {
  id: string;
  text: string;
  timestamp: number;
}

export interface LogMessage extends Message {
  level: 'log';
}

export interface ErrorMessage extends Message {
  level: 'error';
}

export interface WarningMessage extends Message {
  level: 'warning';
}

export interface DebugMessage extends Message {
  level: 'debug';
}
