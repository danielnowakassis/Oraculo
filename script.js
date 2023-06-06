var mainContainer = document.querySelector('main');
var datasetsPerPage = 5;
var datasetsSize;
var currentPage = 1;
var pageIndicatorsContainer;
var datasets;
var currentDatasets;

function getDataFromDatasets(){
    return fetch('datasets.json')
        .then(response => response.json())
        .then(data => {
        datasets = data
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
    var datasetsContainer = document.querySelector('.datasets-list');

    datasetsContainer.innerHTML = "";

    var datasetListTitle = document.createElement('h1');
    datasetListTitle.classList.add('dataset-list-title');
    datasetListTitle.textContent = 'Datasets';
    datasetsContainer.appendChild(datasetListTitle);

    var startIndex = (page - 1) * datasetsPerPage;  
    var endIndex = startIndex + datasetsPerPage;

    var searchBarInput = document.querySelector('.search-bar input');

    var filterValue = searchBarInput.value.toLowerCase();

    var filteredDatasets = filterValue
        ? datasets.filter(function(dataset) {
            var datasetTitle = dataset.title.toLowerCase();
            var datasetAuthors = dataset.authors.map(author => author.toLowerCase());
            var datasetConference = dataset.conference.toLowerCase();
            var datasetYear = dataset.year.toString().toLowerCase();
            var datasetTopics = dataset.topics.map(topic => topic.toLowerCase());
              return (
                datasetTitle.includes(filterValue) ||
                datasetAuthors.some(author => author.includes(filterValue)) ||
                datasetConference.includes(filterValue) ||
                datasetYear.includes(filterValue) ||
                datasetTopics.some(topic => topic.includes(filterValue))
              );
          })
        : datasets; 
    
    currentDatasets = filterValue ? filteredDatasets : datasets;
        
    for (let i = startIndex; i < endIndex && i < currentDatasets.length; i++) {
        let dataset = currentDatasets[i];
        var datasetContainer = document.createElement('div');
        datasetContainer.classList.add('dataset-container');
    
        var titleContainer = document.createElement('div');
        titleContainer.classList.add('dataset-title-container');
    
        var datasetTitle = document.createElement('h2');
        datasetTitle.classList.add('dataset-title');
        datasetTitle.textContent = dataset.title;
    
        var dropdownButton = document.createElement('button');
        dropdownButton.classList.add('dataset-dropdown-button');
        dropdownButton.setAttribute('type', 'button');
    
        var chevronIcon = document.createElement('img');
        chevronIcon.classList.add('dataset-chevron');
        chevronIcon.setAttribute('src', 'images/Chevron-Down.svg');
    
        var datasetBody = document.createElement('div');
        datasetBody.classList.add('dataset-body');
    
        var datasetDescription = document.createElement('p');
        datasetDescription.classList.add('dataset-description');
        datasetDescription.textContent = dataset.authors.join(', ') + ', "' + dataset.title + '",' + dataset.conference + ', ' + dataset.year + ', pp. ' + dataset.pages;
    
        var buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('dataset-buttons-container');
    
        var downloadButton = document.createElement('button');
        downloadButton.classList.add('dataset-button');
        downloadButton.textContent = 'Download';
    
        var bibButton = document.createElement('button');
        bibButton.classList.add('dataset-button');
        bibButton.textContent = 'BIB';
    
        var abntButton = document.createElement('button');
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
            var div = this.parentNode.nextElementSibling;
            div.classList.toggle('hidden');
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