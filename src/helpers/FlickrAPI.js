import * as FileSystem from 'expo-file-system';

export async function searchPhotos(keyword, page, isOnline) {
  const apiKey = '28d845f29cf1d71a2b89123de6be3448'
  const remoteURI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
    apiKey + '&format=json&nojsoncallback=1&extras=url_m,description&per_page=30&page=' +
    page +' &text='+ 
    keyword;

  const filesystemURI = `${FileSystem.documentDirectory}${keyword}.json`;
  const metadata = await FileSystem.getInfoAsync(filesystemURI);
  
  
  // Check if user is offline
  if(!isOnline) {
    
    console.log('user is offline');
    //check if search query is available in cache
    if (metadata.exists) {
      console.log(keyword + 'metadata found');
      // if available in cache then return cached result
      const data = await FileSystem.readAsStringAsync(filesystemURI);
      const obj = JSON.parse(data);
      const photos = obj.photos;
      const photo = photos.photo;
      return photo
    }
    return null;
  }

  // if user is online then download and cache data and return list of photos
  console.log('user is online');
  const searchObject = await FileSystem.downloadAsync(
    remoteURI,
    filesystemURI
  );
  const data = await FileSystem.readAsStringAsync(filesystemURI);
  const obj = JSON.parse(data);
  const photos = obj.photos;
  const photo = photos.photo;
  return photo;
}