import ref from './ref.js';
import fetchCountries from './fetchCountries.js';
import { info, error, defaultModules } from '../../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyDesktop from '@pnotify/desktop';
import { defaults } from '@pnotify/core';
import countryCardTempl from '../templates/country.hbs';
import countryListTempl from '../templates/countryList.hbs';

const PNotifyFontAwesome5Fix = require('@pnotify/font-awesome5-fix');
const PNotifyFontAwesome5 = require('@pnotify/font-awesome5');
defaultModules.set(PNotifyDesktop, {});
defaultModules.set(PNotifyFontAwesome5Fix, {});
defaultModules.set(PNotifyFontAwesome5, {});
defaults.delay = 2000;
defaults.styling = 'material';
defaults.mode = 'light';

let debounce = require('lodash.debounce');
const { countryFilterRef, countryInfoRef } = ref;
countryFilterRef.addEventListener('input', debounce(onInput, 500));

function onInput(event) {
  const promiseFetchCountry = fetchCountries(event.target.value);

  if (promiseFetchCountry === undefined) {
    return;
  }

  promiseFetchCountry
    .then(data => {
      if (data && data.length > 10) {
        info({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      } else {
        if (!data) {
          info({
            text: 'Nothing found!',
          });
        } else {
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
