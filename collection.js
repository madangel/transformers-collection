document.addEventListener('DOMContentLoaded', async () => {
    const toyList = document.getElementById('toyList');
    const toggleMenu = document.getElementById('toggleMenu');
    const sortOptions = document.getElementById('sortOptions');
    const filterAlliance = document.getElementById('filterAlliance');
    const searchContainer = document.getElementById('searchContainer');
    const searchBar = document.getElementById('searchBar');
    const clearButton = document.getElementById('clearButton');
    const menu = document.getElementById('menu');

    // Fetch toy data from Firebase
    const toys = await fetchData('https://transformers-collection-default-rtdb.europe-west1.firebasedatabase.app/toys.json');

    // Convert the toys object to an array with an ID for each toy
    const toysArray = Object.keys(toys).map(key => ({
        id: key,
        ...toys[key]
    }));

    // Variables to store the current search query, sort criteria, and filter value
    let filteredToys = [];
    let searchQuery = '';
    let sortCriteria = '';
    let allianceFilter = 'all';

    if (toys && typeof toys === 'object') {
        filteredToys = Object.values(toys);
    } else {
        console.error("The toys object is not defined or is null:", toys);
    }
    
    // Display toys on the page (keeping the original thumbnail styling)
    function displayToys(toys) {
        // Filter and sort toys based on the current values of search, sort, and filter options
        let visibleToys = filteredToys;
        if (searchQuery) {
            visibleToys = visibleToys.filter(toy => toy.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (allianceFilter !== 'all') {
            visibleToys = visibleToys.filter(toy => toy.alliance === allianceFilter);
        }
        if (sortCriteria) {
            visibleToys.sort((a, b) => {
                let valA = a[sortCriteria];
                let valB = b[sortCriteria];
                // Convert undefined or null values to empty strings or zero for comparison
                if (valA === undefined || valA === null) valA = '';
                if (valB === undefined || valB === null) valB = '';
                if (sortCriteria === 'reference') {
                    // Convert reference values to strings for comparison
                    valA = String(valA);
                    valB = String(valB);
                }
                // Compare as strings if both are strings, otherwise compare as numbers
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return valA.localeCompare(valB);
                } else {
                    return (valA || 0) - (valB || 0);
                }
            });
        }

        // Display the filtered and sorted toys
        toyList.innerHTML = ''; // Clear existing list of toys
        visibleToys.forEach(toy => {
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
                    if (e.target.alt == `${toy.reference}/001.jpg`) {
                        e.target.src = thumbnail2 + "&" + new Date().getTime();
                        e.target.alt = `${toy.reference}/002.jpg`;
                    } else {
                        e.target.src = thumbnail1 + "&" + new Date().getTime();
                        e.target.alt = `${toy.reference}/001.jpg`;
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

    // Function to display or hide the clear button based on input value
    function toggleClearButton() {
        if (searchBar.value) {
            searchContainer.classList.add('has-text'); // Show the clear button
        } else {
            searchContainer.classList.remove('has-text'); // Hide the clear button
        }
    }

    // Toggle the display of the menu and update the button icon
    toggleMenu.addEventListener('click', () => {
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
            toggleMenu.innerHTML = '&#9650;'; // Change to "Hide Menu" with an upward arrow
        } else {
            menu.style.display = 'none';
            toggleMenu.innerHTML = '&#9660;'; // Change to "Show Menu" with a downward arrow
        }
    });

    // Update sort criteria and re-display toys
    sortOptions.addEventListener('change', () => {
        sortCriteria = sortOptions.value;
        displayToys(); // Re-display toys based on the new sort criteria
    });

    // Update filter value and re-display toys
    filterAlliance.addEventListener('change', () => {
        allianceFilter = filterAlliance.value;
        displayToys(); // Re-display toys based on the new filter value
    });

    // Update search query and re-display toys
    searchBar.addEventListener('input', () => {
        searchQuery = searchBar.value;
        toggleClearButton();
        displayToys(); // Re-display toys based on the new search query
    });

    // Add event listener to the clear button to clear the search bar
    clearButton.addEventListener('click', () => {
        searchBar.value = ''; // Clear the input
        toggleClearButton(); // Hide the clear button
        //displayToys(); // Re-display the full toy list or clear the search results
    });

    // Initial display of all toys when the page loads
    displayToys(toysArray);
});
