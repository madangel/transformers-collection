document.addEventListener('DOMContentLoaded', async () => {
    const toyNameElement = document.getElementById('toyName');
    const toyReferenceElement = document.getElementById('toyReference');
    const toyPhotosElement = document.getElementById('toyPhotos');
    const pdfViewerElement = document.getElementById('pdfViewer');

    const toyId = new URLSearchParams(window.location.search).get('id');
    const response = await fetch(`https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys/${toyId}.json`);
    const toy = await response.json();

    toyNameElement.innerText = toy.name;
    toyReferenceElement.innerText = toy.reference;

    toyPhotosElement.innerHTML = toy.photos.map(photo => `
        <img src="${photo}" alt="Toy Photo">
    `).join('');

    pdfViewerElement.src = toy.notice;
});
