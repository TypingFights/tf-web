import Helper from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';

export default Helper.extend({
  i18n: service(),
  compute([textLength, totalTimeMilliseconds]) {
    const i18n = this.get('i18n');
    const cpm = (textLength / totalTimeMilliseconds) * 60e3;
    if (i18n.locale === 'en') {
      return htmlSafe(`${(cpm / 5).toFixed(0)}&nbsp;${i18n.t('game.speed.wpm')}`);
    }
    return htmlSafe(`${cpm.toFixed(0)}&nbsp;${i18n.t('game.speed.cpm')}`);
  },
});
