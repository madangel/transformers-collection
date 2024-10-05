document.addEventListener('DOMContentLoaded', async () => {
    const toyList = document.getElementById('toyList');
    const sortOptions = document.getElementById('sortOptions');
    const searchBar = document.getElementById('searchBar');
    const filterAlliance = document.getElementById('filterAlliance');
    const filterCollection = document.getElementById('filterCollection');
    const toggleMenu = document.getElementById('toggleMenu');
    const menu = document.getElementById('menu');

    // Toggle menu display
    toggleMenu.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    // Fetch toy data from Firebase
    const response = await fetch('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys.json');
    let toys = await response.json();

    // Fetch collections data from Firebase
    const collectionsResponse = await fetch('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/collections.json');
    const collections = await collectionsResponse.json();

    // Populate the filterCollection dropdown with the collections from Firebase
    populateCollectionFilter(collections);

    // Display toys on the page (using the original styling and structure)
    function displayToys(toys) {
        toyList.innerHTML = ''; // Clear existing list
        for (const toyId in toys) {
            const toy = toys[toyId];
            const toyThumbnail = document.createElement('div');
            toyThumbnail.classList.add('toy-thumbnail');
            const url_firebasestorage = 'https://firebasestorage.googleapis.com/v0/b/transformers-collection.appspot.com/o/';
            const thumbnail = url_firebasestorage + 'toys%2F' + toyId + '%2F001.jpg?alt=media';
            const manualIcon = url_firebasestorage + 'icons%2FManual.jpg?alt=media';
            const completIcon = url_firebasestorage + 'icons%2F' + toy.weapon + '.jpg?alt=media';
            const weaponCompletIcon = url_firebasestorage + 'icons%2F' + toy.complete + '.jpg?alt=media';
            const allianceIcon = url_firebasestorage + 'icons%2F' + toy.alliance + '.jpg?alt=media';
            const pdfUrl = url_firebasestorage + 'toys%2F' + toyId + '%2Fnotice.pdf';

            let manual_display = "none";
            try {
                const pdfResponse = await fetch(pdfUrl, { method: 'HEAD' });
                if (pdfResponse.ok) {
                    manual_display = "block";
                }
            } catch (error) {
                console.error('Error checking PDF:', error);
                manual_display = "none";
            }

            // Use original HTML structure for thumbnails
            toyThumbnail.innerHTML = `
                <p>${toy.reference} - ${toy.name}</p> 
                <img src="${thumbnail}" alt="${toyId}/001.jpg">
                <div class="icons">
                    <img src="${manualIcon}" alt="Manual" class="icon" style="display: ${manual_display};"/>
                    <img src="${weaponCompletIcon}" alt="Weapon Complete" class="icon" />
                    <img src="${completIcon}" alt="Complete" class="icon" />
                    <img src="${allianceIcon}" alt="Alliance" class="icon" />
                </div>
            `;

            toyThumbnail.addEventListener('click', () => {
                window.location.href = `description.html?id=${toyId}`;
            });
            toyList.appendChild(toyThumbnail);
        }
    }

    // Populate the collection filter dropdown
    function populateCollectionFilter(collections) {
        filterCollection.innerHTML = '<option value="all">All</option>'; // Reset and add default option
        for (const collection of collections) {
            const option = document.createElement('option');
            option.value = collection;
            option.textContent = collection;
            filterCollection.appendChild(option);
        }
    }

    // Sort toys based on criteria
    function sortToys(criteria) {
        const sortedToys = Object.values(toys).sort((a, b) => a[criteria].localeCompare(b[criteria]));
        const sortedToysObj = {};
        sortedToys.forEach(toy => {
            const key = Object.keys(toys).find(key => toys[key] === toy);
            sortedToysObj[key] = toy;
        });
        displayToys(sortedToysObj);
    }

    // Search toys by name
    function searchToys(query) {
        const filteredToys = Object.values(toys).filter(toy =>
            toy.name.toLowerCase().includes(query.toLowerCase())
        );
        displayToys(filteredToys);
    }

    // Filter toys by alliance and collection
    function filterToys(alliance, collection) {
        const filteredToys = Object.values(toys).filter(toy => {
            const matchesAlliance = alliance === 'all' || toy.alliance === alliance;
            const matchesCollection = collection === 'all' || toy.collection === collection;
            return matchesAlliance && matchesCollection;
        });
        displayToys(filteredToys);
    }

    // Initial display
    displayToys(toys);

    // Event listeners for sorting
    sortOptions.addEventListener('change', () => {
        sortToys(sortOptions.value);
    });

    // Event listener for search
    searchBar.addEventListener('input', () => {
        searchToys(searchBar.value);
    });

    // Event listener for alliance filter
    filterAlliance.addEventListener('change', () => {
        filterToys(filterAlliance.value, filterCollection.value);
    });

    // Event listener for collection filter
    filterCollection.addEventListener('change', () => {
        filterToys(filterAlliance.value, filterCollection.value);
    });
});
