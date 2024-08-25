document.addEventListener('DOMContentLoaded', async () => {
    const toyList = document.getElementById('toyList');
    const response = await fetch('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys.json');
    const toys = await response.json();

    for (const toyId in toys) {
        const toy = toys[toyId];
        const toyThumbnail = document.createElement('div');
        toyThumbnail.classList.add('toy-thumbnail');
        url_firebasestorage = 'https://firebasestorage.googleapis.com/v0/b/transformers-collection.appspot.com/o/';
        thumbnail = url_firebasestorage+'toys%2F'+toyId+'%2F001.jpg?alt=media';
        completIcon = url_firebasestorage+'icons%2F'+toy.alliance+'.jpg'
        weaponCompletIcon = url_firebasestorage+'icons%2F'+toy.alliance+'.jpg'
        allianceIcon = url_firebasestorage+'icons%2F'+toy.alliance+'.jpg'
        toyThumbnail.innerHTML = `
            <p>${toy.name}</p> 
            <img src="${thumbnail}" alt="${toyId}/001.jpg">
            <div class="icons" >
                <img src="${weaponCompletIcon}" alt="Weapon Complet" class="icon" />
                <img src="${completIcon}" alt="Complet" class="icon" />
                <img src="${allianceIcon}" alt="Alliance" class="icon" />
            </div>
        `;
        toyThumbnail.addEventListener('click', () => {
            window.location.href = `description.html?id=${toyId}`;
        });
        toyList.appendChild(toyThumbnail);
    } 
});
