document.addEventListener('DOMContentLoaded', async () => {
    const toyList = document.getElementById('toyList');
    const response = await fetch('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys.json');
    const toys = await response.json();

    for (const toyId in toys) {
        const toy = toys[toyId];
        const toyThumbnail = document.createElement('div');
        toyThumbnail.classList.add('toy-thumbnail');
        thumbnail = 'https://firebasestorage.googleapis.com/v0/b/transformers-collection.appspot.com/o/toys%2F'+toyId+'%2Fthumbnail.jpg?alt=media';
        toyThumbnail.innerHTML = `
            <img src="${thumbnail}" alt="${toyId}/thumbnail.jpg">
            <p>${toy.name}</p>
        `;
        toyThumbnail.addEventListener('click', () => {
            window.location.href = `description.html?id=${toyId}`;
        });
        toyList.appendChild(toyThumbnail);
    } 
});
