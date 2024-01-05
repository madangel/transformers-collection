document.addEventListener('DOMContentLoaded', async () => {
    const toyList = document.getElementById('toyList');
    const response = await fetch('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys.json');
    const toys = await response.json();

    for (const toyId in toys) {
        const toy = toys[toyId];
        const toyThumbnail = document.createElement('div');
        toyThumbnail.classList.add('toy-thumbnail');
        toyThumbnail.innerHTML = `
            <img src="${toy.photos[0]}" alt="${toy.name}">
            <p>${toy.name}</p>
        `;
        toyThumbnail.addEventListener('click', () => {
            window.location.href = `description.html?id=${toyId}`;
        });
        toyList.appendChild(toyThumbnail);
    }
});