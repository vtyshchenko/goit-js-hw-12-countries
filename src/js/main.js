import ref from './ref.js';
import fetchCountries from './fetchCountries.js';
import { alert, defaultModules } from '../../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
defaultModules.set(PNotifyMobile, {});

let debounce = require('lodash.debounce');

ref.countryFilterRef.addEventListener('input', debounce(onInput, 500));

function onInput(event) {
  const promiseFetchCountry = fetchCountries(event.target.value);
  promiseFetchCountry
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        alert({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      } else {
        console.log('gooooooood');
      }
    })
    .catch(error => {
      console.log(`Something went wrong: ${error}!`);
    });
}
