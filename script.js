let allShows = getAllShows();
const rootElem = document.getElementById("root");
let showsDropDown = document.getElementById("chooseShowDropDown");
let showAllEpisodesBtn = document.getElementById("showAllEpisodesBtn")
let showAllShowsBtn = document.getElementById("showAllShowsBtn");
const dropDown = document.getElementById("dropDown");
let searchInput = document.getElementById("search");


//Shows Dropdown


let showNameArray = [];

allShows.forEach(show => {
  showNameArray.push(show.name);
})

showNameArray.sort().forEach(showName => {
let showOption = document.createElement("option")
showOption.innerText = showName;
showsDropDown.append(showOption);
})

showsDropDown.addEventListener("change", function(e){
allShows.forEach(show => {
    if(show.name === e.target.value){
      let apiUrl = "https://api.tvmaze.com/shows/"+ show.id + "/episodes";
      fetch(apiUrl)
      .then(response => response.json())
      .then(data => { 
        let allEpisodes = data;

        function setup() {
          makeEpisodeDropDown(allEpisodes);
          makePageForEpisodes(allEpisodes);
        }

        //This function determines the format of the season and episode nunmber
        function createSeasonDisplayFormat(episodeList){
          let arrayOfEpisodes = [];
          let episodeDisplayFormat = "";
          episodeList.forEach(episode => {
          let seasonNumber = String(episode.season);
            let episodeNumber = String(episode.number);
            if(seasonNumber.length > 1){
              seasonNumber = seasonNumber;
            } else {
              seasonNumber = "0" + seasonNumber;
            }
            if(episodeNumber.length > 1){
              episodeNumber = episodeNumber;
            } else {
              episodeNumber = "0" + episodeNumber;
            }
            episodeDisplayFormat = `S${seasonNumber}E${episodeNumber}`;
            arrayOfEpisodes.push(episodeDisplayFormat)
          })
          return arrayOfEpisodes;
        }

        //This function makes a div for each movie
        function makePageForEpisodes(episodeList) {
          rootElem.innerHTML = "";
          rootElem.className = "episodesContainer";

          //episodes Container
            const episodesContainer= document.createElement("div");
            episodesContainer.className = "episodes";
            rootElem.append(episodesContainer);

          episodeList.forEach((episode, episodeIndex) => {
            //episodes
            const episodeDiv = document.createElement("div");
            episodeDiv.className = "episode";
            episodesContainer.append(episodeDiv);

            //Episode Title
            const title = document.createElement("h2");
            let episodeDisplayFormatArray = createSeasonDisplayFormat(allEpisodes);
            episodeDisplayFormatArray.forEach((format, formatIndex) => {
              if(formatIndex === episodeIndex){
                title.innerText = `${episode.name} ${format}`;
              }
            })
            episodeDiv.append(title)
            
            //Thumbnail
            const thumbnail = document.createElement("img");
            thumbnail.className = "thumbnail";
            thumbnail.src = episode.image.medium;
            thumbnail.alt = `${episode.name} season${episode.season} episode${episode.number}`;
            episodeDiv.append(thumbnail)

            //Summary
            const summary = document.createElement("div");
            summary.innerHTML = episode.summary;
            episodeDiv.append(summary);
          })

          //Disclaimer
          const disclaimer = document.createElement("h4");
          disclaimer.innerHTML = "All data in this page was originally gotten from <a href='https://www.tvmaze.com/1'>TVMaze.com</a>"
          rootElem.append(disclaimer);
          
        }

        //This function handles the search function
        function search(episodeList){
          let searchResult = [];
          let matchCounter = 0;
          let regex = new RegExp(searchValue, 'i');
          episodeList.forEach( episode =>  {
            let episodeName = episode.name;
            let episodeSummary = episode.summary;
            if (regex.test(episodeName) || regex.test(episodeSummary)){
              matchCounter++;
              searchResult.push(episode) 
            }
          })

          makePageForEpisodes(searchResult);
          if(matchCounter !== 73){
            const rootElem = document.getElementById("root");
            matchValue = document.createElement("h1");
            matchValue.innerText = matchCounter + " matches found";
            rootElem.prepend(matchValue)
          }
        }


        window.onload = setup()

        searchInput.addEventListener("input", function(){
          searchValue = document.getElementById("search").value;
          search(allEpisodes)
        })

        //This function creates each dropdown option element
        function makeEpisodeDropDown(episodeList){
          const dropDown = document.getElementById("dropDown");
          episodeList.forEach((episode, episodeIndex) => {
            let episodeOption = document.createElement("option");
            let episodeDisplayFormatArray = createSeasonDisplayFormat(allEpisodes);
          
            episodeDisplayFormatArray.forEach((format, formatIndex) => {
              if(formatIndex === episodeIndex){
                episodeOption.innerText = `${format} - ${episode.name}`;
              }
            })
            dropDown.append(episodeOption);
          })
          
        }

        let dropDown = document.getElementById("dropDown");
        

        //This event listener listens for if an option has been chosen
        dropDown.addEventListener("change", function(e){
          searchValue = this.value.slice(9);
          search(allEpisodes)
        })

        //This button shows all the movies
        showAllEpisodesBtn.addEventListener("click", function(){
          searchValue = "";
          search(allEpisodes);
          let heading = document.querySelector("#root h1");
          heading.remove();
        })

      })
      .catch((error) => {
        let errorMessage = document.createElement("h1");
        errorMessage.classList.add("errorMessage");
        errorMessage.innerHTML = "An error has occurred<br>" + error;
        rootElem.innerHTML = "";
        let errorImage = document.createElement("img");
        errorImage.classList.add("errorImage");
        errorImage.src = "resources\report_problem_black_24dp.svg";
        errorImage.alt = "An error has ocurred";
        rootElem.append(errorImage);
        rootElem.append(errorMessage);
        rootElem.classList.add("errorMessagePosition")
        console.log(errorMessage.innerHTML)
      })
    }
  })
    })


//Homepage setup
function createHomepageSetup(showsArray){
  let showsContainer = document.createElement("div");
  showsContainer.classList.add("showsContainer");
showsArray.forEach(show => {
  if(show.image !== null){
    let showDiv = document.createElement("div");
    showDiv.classList.add("showDiv");
    let thumbnail = document.createElement("img");
    thumbnail.src = show.image.original;
    showDiv.append(thumbnail);
    let title = document.createElement("h1");
    title.classList.add("title");
    title.innerText = show.name;
    showDiv.append(title);
    let detailsDiv = document.createElement("div");
    detailsDiv.classList.add("otherDetails");
    showDiv.append(detailsDiv);
    let genres = document.createElement("div");
    genres.classList.add("genresContainer");
    show.genres.forEach( genre => {
      let genreDiv = document.createElement("div");
      genreDiv.classList.add("genreDiv")
      let genreText = document.createElement("p");
      genreText.innerText = genre;
      genreDiv.append(genreText);
      genres.append(genreDiv);
    });
    detailsDiv.append(genres);
    let duration = document.createElement("p");
    duration.innerText = show.runtime + " minutes";
    detailsDiv.append(duration);
    let showRating = document.createElement("p");
    showRating.innerHTML = "<b>" + show.rating.average.toFixed(1) + "</b>";
    detailsDiv.append(showRating);
    let showSummary = document.createElement("p");
    showSummary.innerHTML = show.summary;
    showDiv.append(showSummary);
    showsContainer.append(showDiv);

    title.addEventListener("click", function(){
      dropDown.style.display = "inline-block";
      showAllEpisodesBtn.style.display = "inline-block"
      showsDropDown.style.display = "none";
        allShows.forEach(show => {
    if(show.name === title.innerHTML){
    
      let apiUrl = "https://api.tvmaze.com/shows/"+ show.id + "/episodes";
      fetch(apiUrl)
      .then(response => response.json())
      .then(data => { 
        let allEpisodes = data;

        function setup() {
          makeEpisodeDropDown(allEpisodes);
          makePageForEpisodes(allEpisodes);
        }

        //This function determines the format of the season and episode nunmber
        function createSeasonDisplayFormat(episodeList){
          let arrayOfEpisodes = [];
          let episodeDisplayFormat = "";
          episodeList.forEach(episode => {
          let seasonNumber = String(episode.season);
            let episodeNumber = String(episode.number);
            if(seasonNumber.length > 1){
              seasonNumber = seasonNumber;
            } else {
              seasonNumber = "0" + seasonNumber;
            }
            if(episodeNumber.length > 1){
              episodeNumber = episodeNumber;
            } else {
              episodeNumber = "0" + episodeNumber;
            }
            episodeDisplayFormat = `S${seasonNumber}E${episodeNumber}`;
            arrayOfEpisodes.push(episodeDisplayFormat)
          })
          return arrayOfEpisodes;
        }

        //This function makes a div for each movie
        function makePageForEpisodes(episodeList) {
          rootElem.innerHTML = "";
          rootElem.className = "episodesContainer";

          //episodes Container
            const episodesContainer= document.createElement("div");
            episodesContainer.className = "episodes";
            rootElem.append(episodesContainer);

          episodeList.forEach((episode, episodeIndex) => {
            //episodes
            const episodeDiv = document.createElement("div");
            episodeDiv.className = "episode";
            episodesContainer.append(episodeDiv);

            //Episode Title
            const title = document.createElement("h2");
            let episodeDisplayFormatArray = createSeasonDisplayFormat(allEpisodes);
            episodeDisplayFormatArray.forEach((format, formatIndex) => {
              if(formatIndex === episodeIndex){
                title.innerText = `${episode.name} ${format}`;
              }
            })
            episodeDiv.append(title)
            
            //Thumbnail
            const thumbnail = document.createElement("img");
            thumbnail.className = "thumbnail";
            thumbnail.src = episode.image.medium;
            thumbnail.alt = `${episode.name} season${episode.season} episode${episode.number}`;
            episodeDiv.append(thumbnail)

            //Summary
            const summary = document.createElement("div");
            summary.innerHTML = episode.summary;
            episodeDiv.append(summary);
          })

          //Disclaimer
          const disclaimer = document.createElement("h4");
          disclaimer.innerHTML = "All data in this page was originally gotten from <a href='https://www.tvmaze.com/1'>TVMaze.com</a>"
          rootElem.append(disclaimer);
          
        }




        //This function handles the search function
        function search(episodeList){
          let searchResult = [];
          let matchCounter = 0;
          let regex = new RegExp(searchValue, 'i');
          episodeList.forEach( episode =>  {
            let episodeName = episode.name;
            let episodeSummary = episode.summary;
            if (regex.test(episodeName) || regex.test(episodeSummary)){
              matchCounter++;
              searchResult.push(episode) 
            }
          })

          makePageForEpisodes(searchResult);
          if(matchCounter !== 73){
            const rootElem = document.getElementById("root");
            matchValue = document.createElement("h1");
            matchValue.innerText = matchCounter + " matches found";
            rootElem.prepend(matchValue)
          }
        }


        window.onload = setup()

        searchInput.addEventListener("input", function(){
          searchValue = document.getElementById("search").value;
          search(allEpisodes)
        })

        //This function creates each dropdown option element
        function makeEpisodeDropDown(episodeList){
          const dropDown = document.getElementById("dropDown");
          episodeList.forEach((episode, episodeIndex) => {
            let episodeOption = document.createElement("option");
            let episodeDisplayFormatArray = createSeasonDisplayFormat(allEpisodes);
          
            episodeDisplayFormatArray.forEach((format, formatIndex) => {
              if(formatIndex === episodeIndex){
                episodeOption.innerText = `${format} - ${episode.name}`;
              }
            })
            dropDown.append(episodeOption);
          })
          
        }

        let dropDown = document.getElementById("dropDown");
        

        //This event listener listens for if an option has been chosen
        dropDown.addEventListener("change", function(e){
          searchValue = this.value.slice(9);
          search(allEpisodes)
        })

        //This button shows all the movies
        showAllEpisodesBtn.addEventListener("click", function(){
          searchValue = "";
          search(allEpisodes);
          let heading = document.querySelector("#root h1");
          heading.remove();
        })

      })
      .catch((error) => console.warn(error))
    }
  })
    })
  }
})
rootElem.append(showsContainer)
}

createHomepageSetup(allShows);

//Homepage search function
//This function handles the search function
        function search(array){
          let searchResult = [];
          let matchCounter = 0;
          let regex = new RegExp(searchValue, 'i');
          array.forEach( show =>  {
            let theName = show.name;
            let theSummary = show.summary;
            if (regex.test(theName) || regex.test(theSummary)){
              matchCounter++;
              searchResult.push(show) 
            }
          })

          createHomepageSetup(searchResult);
          if(matchCounter !== 73){
            const rootElem = document.getElementById("root");
            matchValue = document.createElement("h1");
            matchValue.innerText = matchCounter + " matches found";
            rootElem.prepend(matchValue)
          }
        }

        searchInput.addEventListener("input", function(){
          rootElem.innerHTML = "";
          searchValue = searchInput.value;
            search(allShows);
        })





showAllShowsBtn.addEventListener("click", function(){
  dropDown.style.display = "none";
  showAllEpisodesBtn.style.display = "none";
  rootElem.innerHTML = "";
  createHomepageSetup(allShows);
})