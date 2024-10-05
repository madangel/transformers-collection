document.addEventListener('DOMContentLoaded', function() {
    const url_storage = 'https://firebasestorage.googleapis.com/v0/b/transformers-collection.appspot.com/o/toys%2F'
    const toyNameElement = document.getElementById('toyName');
    const toyCollectionElement = document.getElementById('toyCollection');
    const toyLevelElement = document.getElementById('toyLevel');
    const toyReferenceElement = document.getElementById('toyReference');
    const toyPhotosElement = document.getElementById('toyPhotos');
    const pdfViewerElement = document.getElementById('pdfViewer');
    const pdfLinkElement = document.getElementById('pdfLink');
    const pdfContainerElement = document.getElementById('pdfContainer');

    toyNameElement.addEventListener('click', function (e) {
        // Get the previous page URL (referrer)
        const referrer = document.referrer;
        // Get the current domain name
        const currentDomain = window.location.hostname;
        // Check if the history length is greater than 1 or the referrer is from the same site
        if (history.length > 1 || (referrer !== "" && new URL(referrer).hostname === currentDomain)) {
            history.back();
        } else {
            window.location.href = 'collection.html';
        }
    });

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
            toyCollectionElement.innerText = toy.collection;
            toyLevelElement.innerText = toy.level; 
            toyReferenceElement.innerText = toy.reference;

            if (toy.photos) {
                var photosArray = Object.values(toy.photos);
                toyPhotosElement.innerHTML = photosArray.map(function(photo) {
                    img_src = url_storage + toyId + '%2F' + photo + '?alt=media';
                    return '<img src="' + img_src + '" alt="' + toyId + '"/photo" class="toy-image">';
                }).join('');
            }

            var pdfUrl = url_storage + toyId + '%2Fnotice.pdf';
            fetch(pdfUrl, { method: 'HEAD' })
                .then(function(response) {
                    if (response.ok) {
                        pdfLinkElement.style.display = 'block'; 
                        pdfViewerElement.src = pdfUrl + '?alt=media#toolbar=0';
                        pdfLinkElement.href = 'pdf_viewer.html?pdfUrl=' + encodeURIComponent(toy.notice);
                    } else {
                        pdfLinkElement.style.display = 'none';
                    }
                })
                .catch(function() {
                    pdfLinkElement.style.display = 'none';
                });

            // pdfViewerElement.src = pdfUrl + '#toolbar=0'
            // pdfLinkElement.href = 'pdf_viewer.html?pdfUrl=' + encodeURIComponent(toy.notice);
            // pdfLinkElement.target = '_self';
        });
});
