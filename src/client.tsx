import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppWrapper } from './AppWrapper';
import { UnsopportedBrowserDisplay } from './UnsopportedBrowserDisplay';

if (BigInt) {
  ReactDOM.render(<AppWrapper />, document.getElementById('app'));
} else {
  ReactDOM.render(<UnsopportedBrowserDisplay />, document.getElementById('app'));
}
