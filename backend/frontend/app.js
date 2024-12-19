let currentBookId = null;

document.getElementById('bookForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const titre = document.getElementById('titre').value;
    const auteur = document.getElementById('auteur').value;
    const date_sortie = document.getElementById('date_sortie').value;
    const nb_page = document.getElementById('nb_page').value;

    const bookData = {
        titre: titre,
        auteur: auteur,
        date_sortie: date_sortie,
        nb_page: nb_page,
    };

    fetch('api/livre/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Livre ajouté :', data);
        alert('Livre ajouté avec succès');
        addBookToTable(data);
    })
    .catch((error) => {
        console.error('Erreur lors de l\'ajout du livre:', error);
        alert('Une erreur est survenue lors de l\'ajout du livre');
    });

    document.getElementById('bookForm').reset();

});

function addBookToTable(book) {
    const tableBody = document.getElementById('booksTable').getElementsByTagName('tbody')[0];

    const newRow = tableBody.insertRow();

    const titreCell = newRow.insertCell(0);
    const auteurCell = newRow.insertCell(1);
    const actionsCell = newRow.insertCell(2);

    titreCell.textContent = book.titre;
    auteurCell.textContent = book.auteur;

    const detailsButton = document.createElement('button');
    detailsButton.innerHTML = '<i class="fas fa-eye"></i>';
    detailsButton.classList.add('details-btn');
    detailsButton.addEventListener('click', function () {
        fetch(`api/livre/${book._id}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('modalTitre').textContent = data.titre;
                document.getElementById('modalAuteur').textContent = data.auteur;
                document.getElementById('modalDateSortie').textContent = new Date(data.date_sortie).toLocaleDateString('fr-FR');
                document.getElementById('modalNbPage').textContent = data.nb_page;
                
                document.getElementById('detailsModal').style.display = 'block';
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des détails du livre:', error);
                alert('Une erreur est survenue lors de la récupération des détails du livre.');
            });
    });


    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function () {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le livre "${book.titre}" ?`)) {
            fetch(`api/livre/${book._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (response.ok) {
                    alert(`Le livre "${book.titre}" a été supprimé avec succès.`);
                    const row = deleteButton.closest('tr');
                    row.remove();
                } else {
                    alert(`Une erreur est survenue lors de la suppression du livre "${book.titre}".`);
                }
            })
            .catch((error) => {
                console.error('Erreur lors de la suppression du livre:', error);
                alert('Une erreur est survenue lors de la suppression du livre.');
            });
        }
    });

    actionsCell.appendChild(detailsButton);
    actionsCell.appendChild(deleteButton);

    actionsCell.style.display = 'flex';
    actionsCell.style.width = '200px';
}

function toggleForm() {
    const form = document.getElementById('bookForm');
    const button = document.getElementById('toggleFormBtn');

    if (form.style.display === 'none' || form.style.display === '') {
        form.classList.add('show');
        form.style.display = 'block';
        button.textContent = 'x';
    } else {
        form.classList.remove('show');
        form.style.display = 'none';
        button.textContent = 'Nouveau +';
    }
}

document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('detailsModal').style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target === document.getElementById('detailsModal')) {
      document.getElementById('detailsModal').style.display = 'none';
  }
});

document.getElementById('editBookForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const titre = document.getElementById('editTitre').value;
    const auteur = document.getElementById('editAuteur').value;
    const date_sortie = document.getElementById('editDateSortie').value;
    const nb_page = document.getElementById('editNbPage').value;

    const bookData = {
        titre: titre,
        auteur: auteur,
        date_sortie: date_sortie,
        nb_page: nb_page,
    };

    fetch(`api/livre/${currentBookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Livre modifié avec succès');
        updateBookInTable(data);
        closeModal();
    })
    .catch((error) => {
        console.error('Erreur lors de la modification du livre:', error);
        alert('Une erreur est survenue lors de la modification du livre');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('api/livre')
        .then(response => response.json())
        .then(livres => {
            livres.forEach(book => {
                addBookToTable(book);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des livres:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
  const LIMIT = 5;
  let currentPage = 1; 

  function fetchBooks(page) {
      fetch(`api/livre?page=${page}&limit=${LIMIT}`)
          .then(response => response.json())
          .then(data => {
              const livres = data.livres;
              const pagination = data.pagination;

              const tableBody = document.getElementById('booksTable').getElementsByTagName('tbody')[0];
              tableBody.innerHTML = '';

              livres.forEach(book => {
                  addBookToTable(book);
              });

              updatePagination(pagination);
          })
          .catch(error => {
              console.error('Erreur lors de la récupération des livres:', error);
          });
  }

  function updatePagination(pagination) {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = ''; 
    if (pagination.currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Précédent';
        prevButton.addEventListener('click', function () {
            pagination.currentPage--;
            fetchBooks(pagination.currentPage);
        });
        paginationElement.appendChild(prevButton);
    }
    
    const currentPageButton = document.createElement('span');
    currentPageButton.textContent = `Page ${pagination.currentPage}`;
    paginationElement.appendChild(currentPageButton);
    
    if (pagination.currentPage < pagination.totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Suivant';
        nextButton.addEventListener('click', function () {
            pagination.currentPage++;
            fetchBooks(pagination.currentPage);
        });
        paginationElement.appendChild(nextButton);
    }
}

fetchBooks(currentPage);
});