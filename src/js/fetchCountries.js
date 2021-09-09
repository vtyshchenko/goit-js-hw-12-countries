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
      throw new Error('Something went wrong on api server!');
    }
  } catch (error) {
    console.log(`Something went wrong: ${error}!`);
  }
}
