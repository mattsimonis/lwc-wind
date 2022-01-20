import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import App from 'lw/app';

const app = createElement('lw-app', { is: App });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
