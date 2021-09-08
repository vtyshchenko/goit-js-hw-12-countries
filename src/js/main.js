import ref from './ref.js';
import fetchCountries from './fetchCountries.js';
import { info, error, defaultModules } from '../../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyDesktop from '@pnotify/desktop';

import { defaults } from '@pnotify/core';
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
          countryInfoRef.textContent = '';
          const markup = createMarcup(data);
          countryInfoRef.insertAdjacentHTML('beforeend', markup);
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
    return (
      `<ul  class="country-list">` +
      data
        .map(infoCountry => {
          return `<li>${infoCountry.name}</li>`;
        })
        .join('') +
      `</ul>`
    );
  } else {
    const { name, capital, population, languages, flag } = data[0];

    const languagesList = languages
      .map(language => {
        return `<li>${language.name}</li>`;
      })
      .join('');

    return `
      <h1 class="country-name">${name}</h1>
      <div class="country-info">
        <div class="country-text">
          <p><span class="country-label">Capital:</span> ${capital}</p>
          <p><span class="country-label">Population:</span> ${population}</p>
          <p><span class="country-label">Languages:</span></p>
          <ul>
            ${languagesList}
          </ul>
        </div>
        <div>
          <img src="${flag}" alt="flag of ${name}" width="200px" />
        </div>
      </div>
      `;
  }
}
