import { info, error, defaultModules } from '../../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyDesktop from '@pnotify/desktop';
import { defaults, Stack } from '@pnotify/core';

import ref from './ref.js';
import fetchCountries from './fetchCountries.js';
import countryCardTempl from '../templates/country.hbs';
import countryListTempl from '../templates/countryList.hbs';

// const PNotifyFontAwesome5Fix = require('@pnotify/font-awesome5-fix');
// const PNotifyFontAwesome5 = require('@pnotify/font-awesome5');
defaultModules.set(PNotifyDesktop, {});
// defaultModules.set(PNotifyFontAwesome5Fix, {});
// defaultModules.set(PNotifyFontAwesome5, {});
defaults.delay = 8000;
defaults.styling = 'material';
defaults.stack.dir1 = 'down';
defaults.stack.dir2 = 'left';
// defaults.mode = 'light';
console.log(defaults);
const myStack = new Stack({ dir1: 'down', firstpos1: 25 });

let debounce = require('lodash.debounce');
const { countryFilterRef, countryInfoRef } = ref;
countryFilterRef.addEventListener('input', debounce(onInput, 500));

function onInput(event) {
  const promiseFetchCountry = fetchCountries(event.target.value);

  promiseFetchCountry
    .then(response => {
      if (response === undefined) {
        return;
      }

      if (response.status === 200) {
        return response.json();
      } else {
        if (response.status === 404) {
          error({
            text: 'Nothing found!',
          });
        } else {
          throw new Error(`Something went wrong on api server! Response status ${response.status}`);
        }
      }
    })
    .then(data => {
      countryInfoRef.innerHTML = '';
      if (data && data.length > 10) {
        info({
          text: 'Too many matches found. Please enter a more specific query!',
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
