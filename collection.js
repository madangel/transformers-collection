document.addEventListener('DOMContentLoaded', function() {
    var toyList = document.getElementById('toyList');
    fetch('https://YOUR-FIREBASE-PROJECT-ID.firebaseio.com/toys.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(toys) {
            toyList.innerHTML = toys.map(function(toy) {
                return '<div class="toy-thumbnail" onclick="redirectToDescription(\'' + toy.id + '\')">' +
                           '<img src="' + toy.photos[0] + '" alt="' + toy.name + '">' +
                           '<p>' + toy.name + '</p>' +
                         '</div>';
            }).join('');
        });
});

function redirectToDescription(toyId) {
    window.location.href = 'description.html?id=' + toyId;
}
