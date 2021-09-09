import { info, error } from '../../node_modules/@pnotify/core/dist/PNotify.js';

export default async function fetchCountries(searchQuery) {
  if (searchQuery.length === 0) {
    return;
  }

  const url = `https://restcountries.eu/rest/v2/name/${searchQuery}`;
  const myRequest = new Request(url);

  try {
    const response = await fetch(myRequest);

    if (response.status === 200) {
      return response.json();
    } else {
      if (response.status === 404) {
        info({
          text: 'Nothing found!',
        });
      } else {
        throw new Error(`Something went wrong on api server! Response status ${response.status}`);
      }
    }
  } catch (err) {
    error({ text: `Something went wrong: ${err}!` });
  }
}
