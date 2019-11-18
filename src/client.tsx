import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { buildServices } from './services/Services';

const services = buildServices();

ReactDOM.render(<App services={services} />, document.getElementById('app'));
