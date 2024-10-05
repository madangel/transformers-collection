document.addEventListener('DOMContentLoaded', async () => {
    const toyList = document.getElementById('toyList');
    const sortOptions = document.getElementById('sortOptions');
    const searchBar = document.getElementById('searchBar');
    const filterAlliance = document.getElementById('filterAlliance');
    const toggleMenu = document.getElementById('toggleMenu');
    const menu = document.getElementById('menu');

    // Fetch toy data from Firebase
    const toys = await fetchData('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys.json');

    // Convert the toys object to an array with an ID for each toy
    const toysArray = Object.keys(toys).map(key => ({
        id: key,
        ...toys[key]
    }));

    // Display toys on the page (keeping the original thumbnail styling)
    function displayToys(toys) {
        toyList.innerHTML = ''; // Clear existing list of toys
        toys.forEach(toy => {
            const toyThumbnail = document.createElement('div');
            toyThumbnail.classList.add('toy-thumbnail');
            const url_firebasestorage = 'https://firebasestorage.googleapis.com/v0/b/transformers-collection.appspot.com/o/';
            const thumbnail1 = url_firebasestorage + 'toys%2F' + toy.reference + '%2F001.jpg?alt=media';
            const thumbnail2 = url_firebasestorage + 'toys%2F' + toy.reference + '%2F002.jpg?alt=media';
            const manualIcon = url_firebasestorage + 'icons%2FManual.jpg?alt=media';
            const completIcon = url_firebasestorage + 'icons%2F' + toy.weapon + '.jpg?alt=media';
            const weaponCompletIcon = url_firebasestorage + 'icons%2F' + toy.complete + '.jpg?alt=media';
            const allianceIcon = url_firebasestorage + 'icons%2F' + toy.alliance + '.jpg?alt=media';
            const pdfUrl = url_firebasestorage + 'toys%2F' + toy.reference + '%2Fnotice.pdf';

            let manual_display = "none";

            // Use an async function inside to handle the await fetch for checking PDF availability
            (async () => {
                try {
                    const pdfResponse = await fetch(pdfUrl, { method: 'HEAD' });
                    if (pdfResponse.ok) {
                        manual_display = "block";
                    }
                } catch (error) {
                    console.warn('Error checking PDF:', error);
                    manual_display = "none";
                }
                // Create the thumbnail image element
                const imgElement = document.createElement('img');
                imgElement.id = `${toy.reference}`;
                imgElement.src = thumbnail1; // Start with the first image
                imgElement.alt = `${toy.reference}/001.jpg`;
                
                // Update the inner HTML after the PDF check
                toyThumbnail.innerHTML = `
                    <p>${toy.name}</p> 
                `;
                toyThumbnail.appendChild(imgElement); // Append the image element after creating it
                toyThumbnail.innerHTML += `
                    <div class="icons">
                        <img src="${manualIcon}" alt="Manual" class="icon" style="display: ${manual_display};"/>
                        <img src="${weaponCompletIcon}" alt="Weapon Complete" class="icon" />
                        <img src="${completIcon}" alt="Complete" class="icon" />
                        <img src="${allianceIcon}" alt="Alliance" class="icon" />
                    </div>
                `;

                // Change Picture
                document.getElementById(`${toy.reference}`).addEventListener('click', (e) => {
                    e.target.src = "";
                    if (e.target.alt == `${toy.reference}/002.jpg`) {
                        e.target.src = thumbnail2 + "&" + new Date().getTime();
                        e.target.alt = `${toy.reference}/001.jpg`;
                    } else {
                        e.target.src = thumbnail1 + "&" + new Date().getTime();
                        e.target.alt = `${toy.reference}/002.jpg`;
                    }
                    e.stopPropagation(); // Stops the event from propagating to parent elements
                });
            })();

            toyThumbnail.addEventListener('click', () => {
                window.location.href = `description.html?id=${toy.reference}`;
            });
            toyList.appendChild(toyThumbnail);
        });
    }

    // Function to fetch data from a given URL (to be used for toys)
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return {};
        }
    }

    // Function to sort toys based on a selected criteria
    function sortToys(criteria) {
        const sortedToys = toysArray.slice().sort((a, b) => {
            // Check if the criteria value is a string
            if (typeof a[criteria] === 'string' && typeof b[criteria] === 'string') {
                return a[criteria].localeCompare(b[criteria]);
            } else {
                // For numbers or undefined values, do a regular comparison
                return (a[criteria] || 0) - (b[criteria] || 0);
            }
        });
        displayToys(sortedToys); // Use the sorted array to display the toys
    }

    // Function to search toys by their name
    function searchToys(query) {
        const filteredToys = toysArray.filter(toy =>
            toy.name.toLowerCase().includes(query.toLowerCase())
        );
        displayToys(filteredToys);
    }

    // Function to filter toys based on alliance only
    function filterToys(alliance) {
        const filteredToys = toysArray.filter(toy => {
            const matchesAlliance = alliance === 'all' || toy.alliance === alliance;
            return matchesAlliance;
        });
        displayToys(filteredToys);
    }

    // Event listeners for sorting
    sortOptions.addEventListener('change', () => {
        sortToys(sortOptions.value);
    });

    // Event listener for search bar input
    searchBar.addEventListener('input', () => {
        searchToys(searchBar.value);
    });

    // Event listener for filtering by alliance
    filterAlliance.addEventListener('change', () => {
        filterToys(filterAlliance.value);
    });

    // Toggle the display of the menu and update the button icon
    toggleMenu.addEventListener('click', () => {
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
            toggleMenu.innerHTML = 'Hide Menu &#9650;'; // Change to "Hide Menu" with an upward arrow
        } else {
            menu.style.display = 'none';
            toggleMenu.innerHTML = 'Show Menu &#9660;'; // Change to "Show Menu" with a downward arrow
        }
    });

    // Initial display of all toys when the page loads
    displayToys(toysArray);
});
