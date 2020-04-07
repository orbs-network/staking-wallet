import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppWrapper } from './AppWrapper';
import { UnsopportedBrowserDisplay } from './UnsopportedBrowserDisplay';

// @ts-ignore
const bigIntSupported = BigInt(1) !== 'unsupported';
const isSupported = bigIntSupported;

if (isSupported) {
  ReactDOM.render(<AppWrapper />, document.getElementById('app'));
} else {
  ReactDOM.render(<UnsopportedBrowserDisplay />, document.getElementById('app'));
}
