import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppWrapper } from './AppWrapper';
import { UnsopportedBrowserDisplay } from './UnsopportedBrowserDisplay';

// DEV_NOTE : For now, we wont have a filter
// TODO : ORL : Add a filter to find unsupported browsers (if needed).
const isSupported = true;

if (isSupported) {
  ReactDOM.render(<AppWrapper />, document.getElementById('app'));
} else {
  ReactDOM.render(<UnsopportedBrowserDisplay />, document.getElementById('app'));
}
