document.addEventListener('DOMContentLoaded', function() {
    loadAvaliacoes();

    document.querySelectorAll('.avaliar-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postoId = this.dataset.posto;
            document.getElementById('avaliacao-form').dataset.posto = postoId;
            document.getElementById('avaliacao-modal').style.display = 'block';
        });
    });

    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('avaliacao-modal').style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('avaliacao-modal')) {
            document.getElementById('avaliacao-modal').style.display = 'none';
        }
    });

    document.querySelector('#avaliacao-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const postoId = this.dataset.posto;
        const nome = this.querySelector('input[type="text"]').value;
        const texto = this.querySelector('textarea').value;
        const rating = this.querySelector('input[name="rating"]').value;

        const avaliacao = {
            nome: nome,
            texto: texto,
            rating: rating
        };

        saveAvaliacao(postoId, avaliacao);
        this.querySelector('input[type="text"]').value = '';
        this.querySelector('textarea').value = '';
        clearStars(this);
        document.getElementById('avaliacao-modal').style.display = 'none';
    });

    document.querySelectorAll('.avaliacao-form .stars span').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.value;
            const form = this.closest('form');
            form.querySelector('input[name="rating"]').value = rating;
            highlightStars(form, rating);
        });
    });
});

function loadAvaliacoes() {
    document.querySelectorAll('.avaliacoes ul').forEach(ul => {
        const postoId = ul.id.split('-')[1];
        const avaliacoes = JSON.parse(localStorage.getItem(postoId) || '[]');
        ul.innerHTML = ''; // Limpa a lista antes de adicionar as avaliações
        avaliacoes.forEach(avaliacao => {
            addAvaliacaoToList(ul, avaliacao);
        });
    });
}

function saveAvaliacao(postoId, avaliacao) {
    const avaliacoes = JSON.parse(localStorage.getItem(postoId) || '[]');
    avaliacoes.push(avaliacao);
    localStorage.setItem(postoId, JSON.stringify(avaliacoes));
    const ul = document.getElementById(`avaliacoes-${postoId}`);
    addAvaliacaoToList(ul, avaliacao);
}

function addAvaliacaoToList(ul, avaliacao) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${avaliacao.nome}</strong>: ${avaliacao.texto} - ${renderStars(avaliacao.rating)}<button class="delete-btn" onclick="deleteAvaliacao('${ul.id}', this)">Excluir</button>`;
    ul.appendChild(li);
}

function deleteAvaliacao(ulId, button) {
    const li = button.parentNode;
    const ul = li.parentNode;
    const index = Array.from(ul.children).indexOf(li);

    // Remove a avaliação da lista na interface
    ul.removeChild(li);

    // Remove a avaliação do localStorage
    const postoId = ulId.split('-')[1];
    const avaliacoes = JSON.parse(localStorage.getItem(postoId) || '[]');
    avaliacoes.splice(index, 1);
    localStorage.setItem(postoId, JSON.stringify(avaliacoes));
}

function renderStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < rating ? '&#9733;' : '&#9734;';
    }
    return stars;
}

function highlightStars(form, rating) {
    form.querySelectorAll('.stars span').forEach(star => {
        star.classList.remove('selected');
    });
    for (let i = 0; i < rating; i++) {
        form.querySelectorAll('.stars span')[i].classList.add('selected');
    }
}

function clearStars(form) {
    form.querySelectorAll('.stars span').forEach(star => {
        star.classList.remove('selected');
    });
    form.querySelector('input[name="rating"]').value = '';
}
