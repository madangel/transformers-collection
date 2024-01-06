document.addEventListener('DOMContentLoaded', function() {
    var url_src = 'https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys'
    var toyNameElement = document.getElementById('toyName');
    var toyLevelElement = document.getElementById('toyLevel');
    var toyReferenceElement = document.getElementById('toyReference');
    var toyPhotosElement = document.getElementById('toyPhotos');
    var pdfViewerElement = document.getElementById('pdfViewer');
    var pdfLinkElement = document.getElementById('pdfLink');
    var pdfContainerElement = document.getElementById('pdfContainer');

    function checkFileExistence(source) {
        fetch(source, { method: 'HEAD', mode: 'no-cors' })
            .then(function(response) {
                if (response.ok) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(function(error) {
                return false;
            });
    }

    if (pdfLinkElement && pdfContainerElement) {
        pdfLinkElement.addEventListener('click', function() {
            pdfContainerElement.style.display = (pdfContainerElement.style.display === 'none') ? 'block' : 'none';
        });
    }

    var toyId = new URLSearchParams(window.location.search).get('id');
    fetch(url_src + '/' + toyId + '.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(toy) {
            toyNameElement.innerText = toy.name;
            toyLevelElement.innerText = toy.level + "/5"; 
            toyReferenceElement.innerText = toy.reference;

            if (toy.photos) {
                var photosArray = Object.values(toy.photos);
                toyPhotosElement.innerHTML = photosArray.map(function(photo) {
                    img_src = url_src + '%2F' + toyId + '%2F' + photo + '?alt=media';
                    return '<img src="' + img_src + '" alt="' + toyId + '"/photo" class="toy-image">';
                }).join('');
            }

            pdf_src = url_src + '%2F' + toyId + '%2Fnotice.pdf';
            if (checkFileExistence(pdf_src)) {
                pdf_src = pdf_src + '?alt=media'
                pdfViewerElement.src = pdf_src;
                pdfLinkElement.href = 'pdf_viewer.html?pdfUrl=' + encodeURIComponent(toy.notice);
                // pdfLinkElement.target = '_self';
            }
        });
});
