import { revealText } from './reveal-text';
import { revealList } from './reveal-list';
// import { revealCard } from './reveal-card';
import { selectAll } from '../utils';

/* eslint-disable no-unused-vars */

const heads = selectAll('h2.reveal');
revealText(heads, {
  delay: 0.025,
  speed: 0.95,
});

// const paras = selectAll('p.reveal');
// revealText(paras);

// const revealCards = revealCard(selectAll('.card'));

// const lists = selectAll(':is(div,ul,li) > ul.list');
// revealList(lists);

/* eslint-enable no-unused-vars */
