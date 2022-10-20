import * as _ from 'lodash';
import { Base } from './base';

export class Logger extends Base {

  private _dartString: string;

  constructor(fileName: string, suffix?: string) {
    super(fileName, suffix);

    this._dartString = `import 'dart:developer' as prefix0;
import 'package:logger/logger.dart';

class SimpleLogPrinter extends LogPrinter {
  static int counter = 0;
  final String className;

  SimpleLogPrinter(this.className);

  @override
    List<String> log(LogEvent event) {
      return [event.message];
    }
  }
}

Logger getLogger(String className) {
  return Logger(printer: SimpleLogPrinter(className));
}`;
  }

  get dartString(): string {
    return this._dartString;
  }
}