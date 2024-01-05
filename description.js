document.addEventListener('DOMContentLoaded', function() {
    var toyNameElement = document.getElementById('toyName');
    var toyReferenceElement = document.getElementById('toyReference');
    var toyPhotosElement = document.getElementById('toyPhotos');
    var pdfViewerElement = document.getElementById('pdfViewer');

    var toyId = new URLSearchParams(window.location.search).get('id');
    fetch('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys/' + toyId + '.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(toy) {
            toyNameElement.innerText = toy.name;
            toyReferenceElement.innerText = toy.reference;

            toyPhotosElement.innerHTML = toy.photos.map(function(photo) {
                return '<img src="' + photo + '" alt="Toy Photo">';
            }).join('');

            pdfViewerElement.src = toy.notice;
        });
});
