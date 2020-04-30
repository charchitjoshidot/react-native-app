export function searchPhotos(keyword) {
  const apiKey = '28d845f29cf1d71a2b89123de6be3448'
  const photosSearchURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey
    + '&format=json&nojsoncallback=1&extras=url_m,description&per_page=30&text='
    + keyword;

  return fetch(photosSearchURL)
    .then(response => response.json())
    .then(jsonData => {
      const results = jsonData['photos']
      const photos = results['photo'] 
      return photos
    })
    .catch(err => console.error(err))
}