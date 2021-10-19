import { error } from '@pnotify/core';
import countryCardTempl from '../templates/country.hbs';
import countryListTempl from '../templates/countryList.hbs';

class CreateMarcup {
  constructor(countryFilterRef, countryInfoRef) {
    this.countryFilterRef = countryFilterRef;
    this.countryInfoRef = countryInfoRef;
  }

  renderMarkup(response) {
    this.countryInfoRef.innerHTML = '';
    if (response) {
      if (response.length > 10) {
        this.onManyValues();
      } else {
        this.countryInfoRef.innerHTML = this.createMarcup(response);
      }
    }
  }

  createMarcup(data) {
    if (data.length > 1) {
      console.log(data);
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
