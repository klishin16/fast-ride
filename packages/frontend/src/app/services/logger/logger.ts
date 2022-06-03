import { LogLevel } from "./logelevel.model";

export class Logger {
  private logLevel: LogLevel = new LogLevel();

  constructor(private prefix: string) {
  }

  info(msg: string): void {
    this.logWith(this.logLevel.Info, msg);
  }
  warn(msg: string): void {
    this.logWith(this.logLevel.Warn, msg);
  }
  error(msg: string): void {
    this.logWith(this.logLevel.Error, msg);
  }
  func(msg: string): void {
    this.logWith(this.logLevel.Func, msg)
  }
  status(msg: string): void {
    this.logWith(this.logLevel.Status, msg)
  }

  private logWith(level: any, msg: string): void {
    const msg_with_prefix = `[${this.prefix}] ${msg}`

    if (level <= this.logLevel.Error) {
      switch (level) {
        case this.logLevel.None:
          return console.log(msg);
        case this.logLevel.Info:
          return console.info('%c' + msg_with_prefix, 'color: #6495ED');
        case this.logLevel.Func:
          return console.info('%c' + msg_with_prefix, 'color: #FDD835');
        case this.logLevel.Warn:
          return console.warn('%c' + msg_with_prefix, 'color: #FF8C00');
        case this.logLevel.Error:
          return console.error('%c' + msg_with_prefix, 'color: #DC143C');
        case this.logLevel.Status:
          return console.info('%c' + msg_with_prefix, 'color: #009688');
        default:
          console.debug(msg_with_prefix);
      }
    }
  }
}
