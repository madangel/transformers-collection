document.addEventListener('DOMContentLoaded', function() {
    var toyNameElement = document.getElementById('toyName');
    var toyReferenceElement = document.getElementById('toyReference');
    var toyPhotosElement = document.getElementById('toyPhotos');
    var pdfViewerElement = document.getElementById('pdfViewer');
    var pdfLinkElement = document.getElementById('pdfLink');
    var pdfLinkElement = document.getElementById('pdfLink');
    var pdfContainerElement = document.getElementById('pdfContainer');

    if (pdfLinkElement && pdfContainerElement) {
        pdfLinkElement.addEventListener('click', function() {
            pdfContainerElement.style.display = (pdfContainerElement.style.display === 'none') ? 'block' : 'none';
        });
    }

    var toyId = new URLSearchParams(window.location.search).get('id');
    fetch('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys/' + toyId + '.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(toy) {
            toyNameElement.innerText = toy.name;
            toyReferenceElement.innerText = toy.reference;

            var photosArray = Object.values(toy.photos);
            toyPhotosElement.innerHTML = photosArray.map(function(photo) {
                return '<img src="' + photo + '" alt="Toy Photo" class="toy-image">';
            }).join('');

            pdfViewerElement.src = toy.notice;
            
            pdfLinkElement.href = 'pdf_viewer.html?pdfUrl=' + encodeURIComponent(toy.notice);
            // pdfLinkElement.target = '_self';
        });
});
