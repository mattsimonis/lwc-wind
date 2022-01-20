import LwBaseElement from 'c/lwBaseElement';
import helloLabel from '@salesforce/label/c.lwcwind_Hello';

export default class Hello extends LwBaseElement {
  label = {
    hello: helloLabel
  };
}
