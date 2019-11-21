import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { buildServices } from './services/Services';
import { AppWrapper } from './AppWrapper';

const services = buildServices();

ReactDOM.render(<AppWrapper services={services} />, document.getElementById('app'));
