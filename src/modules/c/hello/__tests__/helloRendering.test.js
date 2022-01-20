import { createElement } from 'lwc';
import Hello from '../hello';

const createComponent = (params = {}) => {
  const element = createElement('c-hello', {
    is: Hello
  });
  Object.assign(element, params);
  document.body.appendChild(element);
  return element;
};

describe('c-hello', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders welcome heading', () => {
    const element = createComponent();
    const headingElement = element.shadowRoot.querySelector('h1');

    expect(headingElement).not.toBeFalsy();
  });

  it('is accessible', () => {
    const element = createComponent();

    return Promise.resolve().then(() => expect(element).toBeAccessible());
  });
});
