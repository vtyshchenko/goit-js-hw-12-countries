import { error, info } from '../../node_modules/@pnotify/core/dist/PNotify.js';

async function fetchCountries(searchQuery) {
  if (searchQuery.length === 0) {
    return Promise.resolve('');
  }

  const url = `https://restcountries.eu/rest/v2/name/${searchQuery}`;
  const myRequest = new Request(url);

  return await fetch(myRequest).then(getDataFromResponse).catch(onError);
}

function getDataFromResponse(response) {
  switch (response.status) {
    case 200:
      return response.json();
    case 404:
      info({
        text: 'Nothing found!',
      });
      return Promise.resolve('');
    default:
      throw new Error(`Something went wrong on api server! Response status ${response.status}`);
  }
}

function onError(err) {
  error({ text: `Something went wrong: ${err}!` });
}

export default { fetchCountries, onError };
