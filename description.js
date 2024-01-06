document.addEventListener('DOMContentLoaded', function() {
    var url_storage = 'https://firebasestorage.googleapis.com/v0/b/transformers-collection.appspot.com/o/toys%2F'
    var toyNameElement = document.getElementById('toyName');
    var toyLevelElement = document.getElementById('toyLevel');
    var toyReferenceElement = document.getElementById('toyReference');
    var toyPhotosElement = document.getElementById('toyPhotos');
    var pdfViewerElement = document.getElementById('pdfViewer');
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
            toyLevelElement.innerText = toy.level; 
            toyReferenceElement.innerText = toy.reference;

            if (toy.photos) {
                var photosArray = Object.values(toy.photos);
                toyPhotosElement.innerHTML = photosArray.map(function(photo) {
                    img_src = url_storage + toyId + '%2F' + photo + '?alt=media';
                    return '<img src="' + img_src + '" alt="' + toyId + '"/photo" class="toy-image">';
                }).join('');
            }

            pdfViewerElement.src = url_storage + toyId + '%2Fnotice.pdf?alt=media'
            pdfLinkElement.href = 'pdf_viewer.html?pdfUrl=' + encodeURIComponent(toy.notice);
            // pdfLinkElement.target = '_self';
        });
});
