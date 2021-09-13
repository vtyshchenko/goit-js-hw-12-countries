import { error, defaults } from '@pnotify/core';

import getRefs from './refs.js';
import countries from './fetchCountries';

import countryCardTempl from '../templates/country.hbs';
import countryListTempl from '../templates/countryList.hbs';

defaults.delay = 2000;
defaults.stack.dir1 = 'up';
defaults.stack.dir2 = 'right';
defaults.mode = 'light';
defaults.firstpos1 = 25;
defaults.firstpos2 = 25;
defaults.spacing1 = 36;
defaults.spacing2 = 36;
defaults.push = 'bottom';
defaults.context = document.body;
defaults.positioned = true;

let debounce = require('lodash.debounce');
const { countryFilterRef, countryInfoRef } = getRefs();

countryFilterRef.addEventListener('input', debounce(onInput, 500));

function onInput(event) {
  countries
    .fetchCountries(event.target.value)
    .then(renderMarkup)
    .catch(err => {
      error({
        text: `Something went wrong: ${err}!`,
      });
    });
}

function renderMarkup(data) {
  countryInfoRef.innerHTML = '';
  if (data) {
    if (data.length > 10) {
      error({
        text: 'Too many matches found. Please enter a more specific query!',
      });
    } else {
      countryInfoRef.innerHTML = createMarcup(data);
    }
  }
}

function createMarcup(data) {
  if (data.length > 1) {
    return countryListTempl(data);
  } else {
    countryFilterRef.value = '';
    return countryCardTempl(data[0]);
  }
}
