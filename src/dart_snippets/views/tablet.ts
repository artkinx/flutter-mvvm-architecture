import * as _ from 'lodash';
import { Base } from '../architecture/base';

export class Tablet extends Base {

  private _dartString: string;

  constructor(fileName: string, suffix: string) {
    super(fileName, suffix);

    let classPrefixList: string[] = this.className.split('Tablet');
    let classPrefix: string | undefined;
    if (!_.isEmpty(classPrefixList)) { classPrefix = _.first(classPrefixList); }

    this._dartString = `part of ${fileName}_view;

class _${this.className} extends StatelessWidget {
  final ${classPrefix}ViewModel viewModel;

  _${this.className}(this.viewModel);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text('${this.className}')),
    );
  }
}`;
  }

  get dartString(): string {
    return this._dartString;
  }

  get demoString(): string {
    return `part of home_view;

class _HomeTablet extends StatelessWidget {
  final HomeViewModel viewModel;

  _HomeTablet(this.viewModel);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tablet'),
        backgroundColor: Colors.indigo,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times: ',
              style: TextStyle(fontSize: 14),
            ),
            Text(
              '\${viewModel.counter}',
              style: Theme.of(context).textTheme.display1,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: viewModel.increment,
        backgroundColor: Colors.indigo,
      ),
    );
  }
}
`;
  }
}