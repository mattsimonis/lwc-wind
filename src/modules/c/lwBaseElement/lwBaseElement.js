import { LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';

// Import static resource containing the design system.
// Will only be added to the DOM on first `loadStyle`.
import lwdesign from '@salesforce/resourceUrl/lwdesign';

/**
 * Base component for extending that includes Tailwind.
 */
export default class LwBaseElement extends LightningElement {
  _loadingResources = true;
  _isHidden = false;

  connectedCallback() {
    loadStyle(this, `${lwdesign}/css/main.css`).then(() => {
      this._loadingResources = false;
      if (this._isHidden) {
        this.template.host.style.opacity = '1';
      }
    });
  }

  renderedCallback() {
    if (this._loadingResources) {
      this.template.host.style.opacity = '0';
      this._isHidden = true;
    }
  }
}
