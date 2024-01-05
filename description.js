document.addEventListener('DOMContentLoaded', async () => {
    const toyNameElement = document.getElementById('toyName');
    const toyReferenceElement = document.getElementById('toyReference');
    const toyPhotosElement = document.getElementById('toyPhotos');
    const pdfViewerElement = document.getElementById('pdfViewer');

    const toyId = new URLSearchParams(window.location.search).get('id');
    const response = await fetch(`https://transformers-collection.firebaseio.com/toys/${toyId}.json`);
    const toy = await response.json();

    toyNameElement.innerText = toy.name;
    toyReferenceElement.innerText = toy.reference;

    toy.photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo;
        img.alt = 'Toy Photo';
        toyPhotosElement.appendChild(img);
    });

    pdfViewerElement.src = toy.notice;
});