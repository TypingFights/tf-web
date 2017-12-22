import { helper } from '@ember/component/helper';

export function preventDefault() {
  return (event) => {
    event.preventDefault();
  };
}

export default helper(preventDefault);
