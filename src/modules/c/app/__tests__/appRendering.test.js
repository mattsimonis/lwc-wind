import { createElement } from 'lwc';
import App from '../app';

const createComponent = (params = {}) => {
  const element = createElement('c-app', {
    is: App
  });
  Object.assign(element, params);
  document.body.appendChild(element);
  return element;
};

describe('c-app', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders welcome message', () => {
    const element = createComponent();
    const headingElement = element.shadowRoot.querySelector('h1');

    expect(headingElement).not.toBeFalsy();
    expect(headingElement.textContent).toContain('Welcome');
  });

  it('is accessible', () => {
    const element = createComponent();
    
    return Promise.resolve().then(() => expect(element).toBeAccessible());
  });
});
