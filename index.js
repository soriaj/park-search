'use strict';

// Enter your API key below. 
const apiKey = '';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(parks, max) {
  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through the parks up to the maxResults enter by the user
  for (let i = 0; i < max; i++){
    $('#results-list').append(
      `<li>
         <h3>${parks.data[i].fullName}</h3>
         <p>${parks.data[i].description}</p>
         <a href='${parks.data[i].url}'>Website: ${parks.data[i].name}</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function formatStateCodes(arr){
   let str ='';
   arr.forEach(cur => {
      str += `stateCode=${cur}&`;
   })
   return str;
}

function getParkList(query, maxResults=10) {
   const queryArr = query.split(',');
   const params = {
      maxResults: maxResults,
      api_key: apiKey
  };
  
  const states = formatStateCodes(queryArr);
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + states + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(data => displayResults(data, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParkList(searchTerm, maxResults);
  });
}

$(watchForm);