import { handleAriaExpanded, select, selectAll } from '../utils';

// https://w3c.github.io/aria-practices/#disclosure
// https://gomakethings.com/building-an-accessible-show/hide-disclosure-component-with-vanilla-js/

const disclosures = selectAll('[data-disclosure]');

disclosures.forEach((disclosure) => {
  let content = select('#' + disclosure.getAttribute('aria-controls'));
  if (!content) return;
});

document.addEventListener('click', (event) => {
  if (!event.target.hasAttribute('data-disclosure')) return;

  let content = select('#' + event.target.getAttribute('aria-controls'));
  if (!content) return;

  content.childNodes[1].classList.toggle('collapse');
  content.childNodes[0].classList.toggle('truncate-overflow');

  handleAriaExpanded(event.target);

  let isExpanded = event.target.getAttribute('aria-expanded') === 'true';
  if(!isExpanded) event.target.textContent = 'Читать полностью';
  else event.target.textContent = 'Скрыть';
});
