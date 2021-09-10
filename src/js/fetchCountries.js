import { error } from '../../node_modules/@pnotify/core/dist/PNotify.js';

export default async function fetchCountries(searchQuery) {
  if (searchQuery.length === 0) {
    return;
  }

  const url = `https://restcountries.eu/rest/v2/name/${searchQuery}`;
  const myRequest = new Request(url);

  try {
    return await fetch(myRequest);
  } catch (err) {
    error({ text: `Something went wrong: ${err}!` });
  }
}
