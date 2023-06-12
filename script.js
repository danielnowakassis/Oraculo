var mainContainer = document.querySelector('main');
var datasetsPerPage = 5;
var datasetsSize;
var currentPage = 1;
var pageIndicatorsContainer;
var datasets;
var currentDatasets;
var modeButton = document.querySelector('.mode');
var modeIcon = document.querySelector('.right-image');
var searchIcon = document.querySelector('.search-icon')
var logo = document.querySelector('.left-image')

modeButton.addEventListener('click', toggleMode);

var darkMode = localStorage.getItem('darkMode') === 'true';
applyDarkMode();

function applyDarkMode() {
    var body = document.body;
    body.classList.toggle('dark-mode', darkMode);

    var isDarkMode = body.classList.contains('dark-mode');
    var iconSource = isDarkMode ? 'images/Sol.svg' : 'images/Lua.svg';
    var searchIconSource = isDarkMode ? 'images/Search-Icon-White.svg' : 'images/Search-Icon.svg';
    var logoSource = isDarkMode ? 'images/Logo-White.svg' : 'images/Logo.svg';

    modeButton.classList.toggle('active', darkMode);
    modeIcon.src = iconSource;
    searchIcon.src = searchIconSource;
    logo.src = logoSource;
}

function toggleMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyDarkMode();
}

function getDataFromDatasets(){
    return fetch('datasets.json')
        .then(response => response.json())
        .then(data => {
        datasets = data.slice()
        currentDatasets = data.slice()
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

function generateBIBReference(dataset) {
    var reference = "@inproceedings{" + dataset.dataset_name + ",\n";
    reference += "  author = {" + dataset.authors.join(" and ") + "},\n";
    reference += "  title = {" + dataset.title + "},\n";
    
    if (dataset.conference) {
      reference += "  booktitle = {" + dataset.conference;
      
      if (dataset.volume) {
        reference += ", " + dataset.volume;
      }
      
      if (dataset.pages) {
        reference += ", " + dataset.pages;
      }
      
      reference += "},\n";
    }
    
    reference += "  year = {" + dataset.year + "},\n";
    
    if (dataset.additionalInfo) {
      reference += "  note = {" + dataset.additionalInfo + "},\n";
    }
    
    reference += "}";
    
    return reference;
  }
  
  function generateABNTReference(dataset) {
    var reference = '';
  
    var authors = formatAuthorsABNT(dataset.authors);
    reference += authors + '. ';
  
    var title = dataset.title + '.';
    reference += title + ' ';
  
    if (dataset.conference) {
      reference += dataset.conference + ', ';
    }
  
    if (dataset.volume) {
      reference += 'v. ' + dataset.volume + ', ';
    }
  
    if (dataset.pages) {
      reference += 'p. ' + dataset.pages + '. ';
    }
  
    if (dataset.additionalInfo) {
      reference += dataset.additionalInfo + '. ';
    }
  
    reference += 'Disponível em: ' + dataset.download + '. ';
  
    reference += dataset.year + '.';
  
    return reference;
  }
  
  function formatAuthorsABNT(authors) {
    var formattedAuthors = [];
    for (var i = 0; i < authors.length; i++) {
      var author = authors[i];
      var parts = author.split(' ');
      var lastName = parts[parts.length - 1].toUpperCase();
      var initials = parts.slice(0, parts.length - 1).map(function(part) {
        return part.charAt(0).toUpperCase() + '.';
      });
      var formattedAuthor = lastName + ', ' + initials.join(' ');
      formattedAuthors.push(formattedAuthor);
    }
    return formattedAuthors.join(', ');
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
    showDatasets(currentPage);
}

function showDatasets(page) {
    let startIndex = (page - 1) * datasetsPerPage;  
    let endIndex = startIndex + datasetsPerPage;

    let searchBarInput = document.querySelector('.search-bar input');
    let filterValue = searchBarInput.value.trim().toLowerCase();

    filterDatasets(filterValue)
    populateDatasets(startIndex, endIndex, currentDatasets)
}

function filterDatasets(filterValue){
    let filteredDatasets = filterValue
    ? datasets.filter(function(dataset) {
        let datasetTitle = dataset.title.toLowerCase();
        let datasetAuthors = dataset.authors.map(author => author.toLowerCase());
        let datasetConference = dataset.conference.toLowerCase();
        let datasetYear = dataset.year.toString().toLowerCase();
        let datasetTopics = dataset.topics.map(topic => topic.toLowerCase());
        let datasetDescription = dataset.description.toLowerCase();
          return (
            datasetTitle.includes(filterValue) ||
            datasetAuthors.some(author => author.includes(filterValue)) ||
            datasetConference.includes(filterValue) ||
            datasetYear.includes(filterValue) ||
            datasetTopics.some(topic => topic.includes(filterValue)) ||
            datasetDescription.includes(filterValue)
          );
      })
    : datasets; 

    currentDatasets = filteredDatasets
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

        datasetDescription.textContent = dataset.description;

        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('dataset-buttons-container');

        let downloadAnchor = document.createElement('a');
        downloadAnchor.href = dataset.download;
    
        let downloadButton = document.createElement('button');
        downloadButton.classList.add('dataset-button');
        downloadButton.textContent = 'Download';

        downloadAnchor.appendChild(downloadButton);

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
    
        buttonsContainer.appendChild(downloadAnchor);
        buttonsContainer.appendChild(bibButton);
        buttonsContainer.appendChild(abntButton);
    
        datasetBody.appendChild(buttonsContainer);
    
        datasetContainer.appendChild(titleContainer);
        datasetContainer.appendChild(datasetBody);
    
        datasetsContainer.appendChild(datasetContainer);

        let bibCard = showReferenceBIBCard(dataset);
        let abntCard = showReferenceABNTCard(dataset);

        datasetContainer.appendChild(bibCard);
        datasetContainer.appendChild(abntCard);

        dropdownButton.addEventListener('click', function () {
            let div = this.parentNode.nextElementSibling;
            div.classList.toggle('hidden');

            let chevronIcon = this.querySelector('.dataset-chevron');
            let isHidden = div.classList.contains('hidden');
            let iconSource = isHidden ? 'images/Chevron-Down.svg' : 'images/Chevron-Up.svg';
                
            chevronIcon.setAttribute('src', iconSource);

            if(isHidden){
                bibButton.classList.remove('selected');
                abntButton.classList.remove('selected');
            }

            let referenceCards = datasetContainer.querySelectorAll('.reference-card-bib, .reference-card-abnt');
            referenceCards.forEach(function(card) {
                card.classList.add('hidden');
            });

        });

        bibButton.addEventListener('click', function () {
            let referenceCard = this.parentNode.parentNode.parentNode.querySelector('.reference-card-bib');
            referenceCard.classList.toggle('hidden');

            bibButton.classList.toggle('selected');
            abntButton.classList.remove('selected');

            let abntCard = this.parentNode.parentNode.parentNode.querySelector('.reference-card-abnt');
            abntCard.classList.add('hidden');
        });

        abntButton.addEventListener('click', function () {
            let referenceCard = this.parentNode.parentNode.parentNode.querySelector('.reference-card-abnt');
            referenceCard.classList.toggle('hidden');

            abntButton.classList.toggle('selected');
            bibButton.classList.remove('selected');

            let bibCard = this.parentNode.parentNode.parentNode.querySelector('.reference-card-bib');
            bibCard.classList.add('hidden');
        });
    };
}

function showReferenceBIBCard(dataset) {
    let card = document.createElement('div');
    card.classList.add('reference-card-bib');
  
    let referenceText = document.createElement('p');
    referenceText.textContent = generateBIBReference(dataset);
    referenceText.style.cursor = 'pointer';

    referenceText.addEventListener('click', (event) => {
        copyTextToClipboard(event.target.textContent);
    });
  
    card.appendChild(referenceText);
    card.classList.add('hidden');
  
    return card;
  }

function showReferenceABNTCard(dataset) {
    let card = document.createElement('div');
    card.classList.add('reference-card-abnt');

    let referenceText = document.createElement('p');
    referenceText.textContent = generateABNTReference(dataset);
    referenceText.style.cursor = 'pointer';

    referenceText.addEventListener('click', (event) => {
        copyTextToClipboard(event.target.textContent);
    });

    card.appendChild(referenceText);
    card.classList.add('hidden');

    return card;
}

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        const message = document.createElement('div');
        message.textContent = 'Text copied to clipboard';
        message.classList.add('copy-message');
        document.body.appendChild(message);
  
        setTimeout(() => {
            message.classList.add('show');
            setTimeout(() => {
              document.body.removeChild(message);
            }, 2000);
          }, 100);
  
        console.log('Text copied to clipboard:', text);
      })
      .catch((error) => {
        console.error('Unable to copy text to clipboard:', error);
      });
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
        window.scrollTo(0, 0);
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