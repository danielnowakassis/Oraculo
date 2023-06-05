document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.getElementsByClassName('dataset-dropdown-button');
  
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function() {
        var div = this.parentNode.nextElementSibling;
  
        div.classList.toggle('hidden');
      });
    }
  });
  