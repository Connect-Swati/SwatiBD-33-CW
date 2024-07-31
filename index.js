let express = require("express");
let app = express();
let port = 3000;
app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});

let watchList = [
  {
    videoId: 1,
    title: "JavaScript Tutorial",
    watched: false,
    url: "https://youtu.be/shorturl1",
  },
  {
    videoId: 2,
    title: "Node.js Basics",
    watched: true,
    url: "https://youtu.be/shorturl2",
  },
  {
    videoId: 3,
    title: "React.js Guide",
    watched: false,
    url: "https://youtu.be/shorturl3",
  },
];

/*
in this excersise updating is done on original array and deletion is done by two steps => filtering out specified data and string updated result in original array. */

/*
Exercise 1: Update the Watched Status of a Video by ID

Create an endpoint /watchlist/update to update the status of a video

Declare variables videoId & watched to accept input from query parameters.

Create a function updateWatchedStatusById which updates the status of a video by ID.

API Call:

http://localhost:3000/watchlist/update?videoId=1&watched=true

Expected Output:

[
  { 'videoId': 1, 'title': 'JavaScript Tutorial', 'watched': true, 'url': '<https://youtu.be/shorturl1>' },
  { 'videoId': 2, 'title': 'Node.js Basics', 'watched': true, 'url': '<https://youtu.be/shorturl2>' },
  { 'videoId': 3, 'title': 'React.js Guide', 'watched': false, 'url': '<https://youtu.be/shorturl3>' }
]
*/

function updateWatchedStatusById(watchList, videoId, watched) {
  let videoFound = false;
  for (let i = 0; i < watchList.length; i++) {
    if (watchList[i].videoId === videoId) {
      watchList[i].watched = watched;
      videoFound = true;
      break; // once we found video no need iterate through rest of the array
    }
  }
  if (!videoFound) {
    return null; // If the video was not found, return null
  }
  /*this  function modifies the watchList array directly and returns it.
   */
  return watchList; // Return the entire updated watch list
}

app.get("/watchlist/update", (req, res) => {
  let videoId = parseInt(req.query.videoId); // in sample value is as int
  let watched = req.query.watched === "true"; // in sample value is as boolean

  console.log("original  watchList:", watchList);
  let result = updateWatchedStatusById(watchList, videoId, watched);
  if (!result) {
    return res.status(404).json({ error: "Video not found" });
  }

  console.log("Updated watchList:", watchList);

  res.json(result); // Return the entire updated watch list
});

/*
Exercise 2: Update the Watched Status of All Videos

Create an endpoint /watchlist/update-all to update the status of all videos

Declare a variable watched to accept input from query parameters.

Create a function updateAllVideosWatchedStatus which updates the status of all videos

API Call:

http://localhost:3000/watchlist/update-all?watched=true

Expected Output:

[
  { 'videoId': 1, 'title': 'JavaScript Tutorial', 'watched': true, 'url': 'https://youtu.be/shorturl1' },
  { 'videoId': 2, 'title': 'Node.js Basics', 'watched': true, 'url': 'https://youtu.be/shorturl2' },
  { 'videoId': 3, 'title': 'React.js Guide', 'watched': true, 'url': 'https://youtu.be/shorturl3' }
]
*/

function updateAllVideosWatchedStatus(watchList, watched) {
  for (let i = 0; i < watchList.length; i++) {
    watchList[i].watched = watched; //  update the watched property of each element
  }
  return watchList; // Return the entire updated watch list
}
app.get("/watchlist/update-all", (req, res) => {
  let watched = req.query.watched === "true";
  console.log("original watchList:", watchList);
  let result = updateAllVideosWatchedStatus(watchList, watched);
  console.log("Updated watchList:", watchList);
  res.json(result);
});

/*
Exercise 3: Delete a Video by ID

Create an endpoint /watchlist/delete to return all videos except the video specified by videoId

Declare a variable videoId to accept input from query parameters.

Create a function shouldDeleteById which deletes the specified video & returns the rest of them

API Call:

http://localhost:3000/watchlist/delete?videoId=2

Expected Output:

[
  { 'videoId': 1, 'title': 'JavaScript Tutorial', 'watched': false, 'url': 'https://youtu.be/shorturl1' },
  { 'videoId': 3, 'title': 'React.js Guide', 'watched': false, 'url': 'https://youtu.be/shorturl3' }
]
*/

function shouldDeleteById(watchList, videoId) {
  // Filter the watchList to exclude the video with the specified ID
  /*
  The filter method checks each video in the watchList and includes it in the new array only if its videoId does not match the specified videoId.
  */
  return watchList.filter((video) => video.videoId !== videoId);

  // The returned value is a new array that includes all videos except the one with the specified videoId
  // Example: if videoId is 2, the returned array will exclude the video with videoId 2
}

app.get("/watchlist/delete", (req, res) => {
  let videoId = parseInt(req.query.videoId);
  let result = shouldDeleteById(watchList, videoId); // Call the function to get the updated list

  if (result.length === watchList.length) {
    // If no video was removed, return a 404 error
    return res.status(404).json({ error: "Video not found" });
  }

  // update the watchList with the updated result
  // this  is important because we want to modify the original watchList array to reflect the changes made by filtering out the specified video.it modifies the original watchList array to reflect the changes made by filtering out the specified video.
  //Without this line, the original watchList would remain unchanged, and subsequent API calls would not see the updated list.
  watchList = result;
  // by doing so if u run same api call it will given no video found error because video of id 2 has been filtered out and original array is updated

  console.log("Updated watchList inside API call:", watchList);

  res.json(result); // send the updated watchList as the response
});

/*
Exercise 4: Delete Watched Videos

Create an endpoint /watchlist/delete-watched to only return videos that haven’t been watched

API Call:

http://localhost:3000/watchlist/delete-watched

Expected Output:

[
  { 'videoId': 1, 'title': 'JavaScript Tutorial', 'watched': false, 'url': '<https://youtu.be/shorturl1>' },
  { 'videoId': 3, 'title': 'React.js Guide', 'watched': false, 'url': '<https://youtu.be/shorturl3>' }
]
*/

function shouldDeleteWatchedVideos(watchList) {
  return watchList.filter((video) => !video.watched);
}

app.get("/watchlist/delete-watched", (req, res) => {
  let result = shouldDeleteWatchedVideos(watchList);
  console.log("original watchList inside API call:", watchList);
  if (result.length === watchList.length) {
    // If no video was removed, return a 404 error
    return res.status(404).json({ error: "Video not found" });
  }

  // update the watchList with the updated result

  watchList = result; // original arry will contain only non watched videos now. so if we run same api again then error will be no videos found
  console.log("Updated watchList inside API call:", watchList);
  res.json(result);
});
