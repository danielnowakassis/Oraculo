var mainContainer = document.querySelector('main');
var datasetsPerPage = 5;
var datasetsSize;
var currentPage = 1;
var pageIndicatorsContainer;
var datasets;
var currentDatasets;
var darkMode = false

var modeButton = document.querySelector('.mode');
var modeIcon = document.querySelector('.right-image');
var searchIcon = document.querySelector('.search-icon')
var logo = document.querySelector('.left-image')
var darkMode = false;

modeButton.addEventListener('click', toggleMode);

function toggleMode() {
    var body = document.body;
    body.classList.toggle('dark-mode');
    
    darkMode = !darkMode;
  
    var isDarkMode = body.classList.contains('dark-mode');
    var iconSource = isDarkMode ? 'images/Sol.svg' : 'images/Lua.svg';
    var searchIconSource = isDarkMode ? 'images/Search-Icon-White.svg' : 'images/Search-Icon.svg'
    var logoSource = isDarkMode ? 'images/Logo-White.svg' : 'images/Logo.svg'
    modeIcon.src = iconSource;
    searchIcon.src = searchIconSource;
    logo.src = logoSource;
}

function getDataFromDatasets(){
    return fetch('datasets.json')
        .then(response => response.json())
        .then(data => {
        datasets = data.slice()
        currentDatasets = datasets.slice()
        populateDatasetList(currentDatasets);
        showDatasets(currentPage, currentDatasets);
    })
        .catch(error => {
        console.error('Error:', error);
    });
}

function generateIEEEReference(dataset) {
    const authorList = dataset.authors.join(", ");
    const title = dataset.title;
    const conference = dataset.conference;
    const volume = dataset.volume;
    const issue = dataset.issue;
    const pages = dataset.pages;
    const year = dataset.year;
  
    const reference = `${authorList}, "${title}", ${conference}, ${volume}, ${issue}, ${pages}, ${year}.`;
  
    return reference;
}

function populateDatasetList(datasets){
    datasetsSize = datasets.length;
    let totalPages = Math.ceil(datasetsSize / datasetsPerPage);

        if (pageIndicatorsContainer) {
        pageIndicatorsContainer.remove();
    }
    pageIndicatorsContainer = document.createElement('div');
    pageIndicatorsContainer.classList.add('page-indicators');

    let indicatorList = document.createElement('ul');
    indicatorList.classList.add('indicator-list');

    
    for (var i = 1; i <= totalPages; i++) {
        var indicatorItem = document.createElement('li');
        indicatorItem.textContent = i;
        indicatorItem.addEventListener('click', handleIndicatorClick);
        indicatorList.appendChild(indicatorItem);
    }
    pageIndicatorsContainer.appendChild(indicatorList);
    mainContainer.appendChild(pageIndicatorsContainer);
    updateActiveIndicator();
    showDatasets(currentPage, datasets);
}

function showDatasets(page, datasets) {
    let startIndex = (page - 1) * datasetsPerPage;  
    let endIndex = startIndex + datasetsPerPage;

    let searchBarInput = document.querySelector('.search-bar input');
    let filterValue = searchBarInput.value.toLowerCase();

    let filteredDatasets = filterValue
        ? datasets.filter(function(dataset) {
            let datasetTitle = dataset.title.toLowerCase();
            let datasetAuthors = dataset.authors.map(author => author.toLowerCase());
            let datasetConference = dataset.conference.toLowerCase();
            let datasetYear = dataset.year.toString().toLowerCase();
            let datasetTopics = dataset.topics.map(topic => topic.toLowerCase());
              return (
                datasetTitle.includes(filterValue) ||
                datasetAuthors.some(author => author.includes(filterValue)) ||
                datasetConference.includes(filterValue) ||
                datasetYear.includes(filterValue) ||
                datasetTopics.some(topic => topic.includes(filterValue))
              );
          })
        : datasets; 
    
    currentDatasets = filteredDatasets

    populateDatasets(startIndex, endIndex, currentDatasets)
}
function populateDatasets(startIndex, endIndex, currentDatasets){
    let datasetsContainer = document.querySelector('.datasets-list');

    datasetsContainer.innerHTML = "";

    let datasetListTitle = document.createElement('h1');
    datasetListTitle.classList.add('dataset-list-title');
    datasetListTitle.textContent = 'Datasets';
    datasetsContainer.appendChild(datasetListTitle);
        
    for (let i = startIndex; i < endIndex && i < currentDatasets.length; i++) {
        let dataset = currentDatasets[i];
        let datasetContainer = document.createElement('div');
        datasetContainer.classList.add('dataset-container');
    
        let titleContainer = document.createElement('div');
        titleContainer.classList.add('dataset-title-container');
    
        let datasetTitle = document.createElement('h2');
        datasetTitle.classList.add('dataset-title');
        datasetTitle.textContent = dataset.title;
    
        let dropdownButton = document.createElement('button');
        dropdownButton.classList.add('dataset-dropdown-button');
        dropdownButton.setAttribute('type', 'button');
    
        let chevronIcon = document.createElement('img');
        chevronIcon.classList.add('dataset-chevron');
        chevronIcon.setAttribute('src', 'images/Chevron-Up.svg');
    
        let datasetBody = document.createElement('div');
        datasetBody.classList.add('dataset-body');
    
        let datasetDescription = document.createElement('p');
        datasetDescription.classList.add('dataset-description');
        datasetDescription.textContent = dataset.authors.join(', ') + ', "' + dataset.title + '",' + dataset.conference + ', ' + dataset.year + ', pp. ' + dataset.pages;
    
        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('dataset-buttons-container');
    
        let downloadButton = document.createElement('button');
        downloadButton.classList.add('dataset-button');
        downloadButton.textContent = 'Download';
    
        let bibButton = document.createElement('button');
        bibButton.classList.add('dataset-button');
        bibButton.textContent = 'BIB';
    
        let abntButton = document.createElement('button');
        abntButton.classList.add('dataset-button');
        abntButton.textContent = 'ABNT';
    
        dropdownButton.appendChild(chevronIcon);
    
        titleContainer.appendChild(datasetTitle);
        titleContainer.appendChild(dropdownButton);
    
        datasetBody.appendChild(datasetDescription);
    
        buttonsContainer.appendChild(downloadButton);
        buttonsContainer.appendChild(bibButton);
        buttonsContainer.appendChild(abntButton);
    
        datasetBody.appendChild(buttonsContainer);
    
        datasetContainer.appendChild(titleContainer);
        datasetContainer.appendChild(datasetBody);
    
        datasetsContainer.appendChild(datasetContainer);

        dropdownButton.addEventListener('click', function () {
            let div = this.parentNode.nextElementSibling;
            div.classList.toggle('hidden');

            let chevronIcon = this.querySelector('.dataset-chevron');
            let isHidden = div.classList.contains('hidden');
            let iconSource = isHidden ? 'images/Chevron-Down.svg' : 'images/Chevron-Up.svg';
                
            chevronIcon.setAttribute('src', iconSource);
        });
    };
}


function updateActiveIndicator() {
    var indicators = pageIndicatorsContainer.querySelectorAll('.indicator-list li');
    indicators.forEach(function (indicator) {
      indicator.classList.remove('active');
    });
    indicators[currentPage - 1].classList.add('active');
}

function handleIndicatorClick(event) {
    var targetPage = parseInt(event.target.textContent);
    if (targetPage !== currentPage) {
        currentPage = targetPage;
        updateActiveIndicator();
        showDatasets(currentPage, currentDatasets);
    }
}
var searchBarInput = document.querySelector('.search-bar input');
searchBarInput.addEventListener('input', function() {
    currentPage = 1;
    pageIndicatorsContainer.innerHTML = ""
    if(searchBarInput.value.trim() === ""){
        populateDatasetList(datasets)
        showDatasets(currentPage, datasets);
    }
    else {
        populateDatasetList(currentDatasets)
        showDatasets(currentPage, currentDatasets);
    }
});

getDataFromDatasets()