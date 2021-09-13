import { error } from '@pnotify/core';
import countryCardTempl from '../templates/country.hbs';
import countryListTempl from '../templates/countryList.hbs';

class CreateMarcup {
  constructor(countryFilterRef, countryInfoRef) {
    this.countryFilterRef = countryFilterRef;
    this.countryInfoRef = countryInfoRef;
  }

  renderMarkup(data) {
    this.countryInfoRef.innerHTML = '';
    if (data) {
      if (data.length > 10) {
        this.onManyValues();
      } else {
        this.countryInfoRef.innerHTML = this.createMarcup(data);
      }
    }
  }

  createMarcup(data) {
    if (data.length > 1) {
      return countryListTempl(data);
    } else {
      this.countryFilterRef.value = '';
      return countryCardTempl(data[0]);
    }
  }

  onManyValues() {
    error({
      text: 'Too many matches found. Please enter a more specific query!',
    });
  }
}

export default CreateMarcup;
