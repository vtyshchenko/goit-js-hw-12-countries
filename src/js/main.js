import { info, error, defaults, Stack } from '@pnotify/core';

import ref from './ref.js';
import fetchCountries from './fetchCountries.js';
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

let myStack = new Stack({
  dir1: 'up',
  dir2: 'right',
  firstpos1: 25,
  firstpos2: 25,
  spacing1: 36,
  spacing2: 36,
  push: 'bottom',
  context: document.body,
});

let debounce = require('lodash.debounce');
const { countryFilterRef, countryInfoRef } = ref;
countryFilterRef.addEventListener('input', debounce(onInput, 500));
// const body = document.getElementsByTagName('body');

function onInput(event) {
  const promiseFetchCountry = fetchCountries(event.target.value);
  // const notif = new Notification('test', {
  //   body: 'body',
  // });

  promiseFetchCountry
    .then(response => {
      if (response === undefined) {
        return;
      }

      if (response.status === 200) {
        return response.json();
      } else {
        if (response.status === 404) {
          info({
            text: 'Nothing found!',
            stack: myStack,
          });
        } else {
          throw new Error(`Something went wrong on api server! Response status ${response.status}`);
        }
      }
    })
    .then(data => {
      countryInfoRef.innerHTML = '';
      if (data && data.length > 10) {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
          stack: myStack,
        });
      } else {
        if (data) {
          countryInfoRef.innerHTML = createMarcup(data);
        }
      }
    })
    .catch(err => {
      error({
        text: `Something went wrong: ${err}!`,
        stack: myStack,
      });
    });
}

function createMarcup(data) {
  if (data.length > 1) {
    return countryListTempl(data);
  } else {
    return countryCardTempl(data[0]);
  }
}
