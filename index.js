const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const repoResults = document.getElementById('repoResults');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') return;
    
    try {
        const users = await searchUsers(searchTerm);
        displayUsers(users);
    } catch (error) {
        console.error('Error searching users:', error.message);
    }
});

async function searchUsers(searchTerm) {
    const url = `https://api.github.com/search/users?q=${searchTerm}`;
    const resp = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await resp.json();
    return data.items;
}

function displayUsers(users) {
    searchResults.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.innerHTML = `
            <div>
                <img src="${user.avatar_url}" alt="Avatar" style="width: 50px; height: 50px;">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            </div>
        `;
        userElement.addEventListener('click', async () => {
            try {
                const repositories = await getUserRepositories(user.login);
                displayRepositories(repositories);
            } catch (error) {
                console.error('Error fetching user repositories:', error.message);
            }
        });
        searchResults.appendChild(userElement);
    });
}

async function getUserRepositories(username) {
    const url = `https://api.github.com/users/${username}/repos`;
    const resp = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const repositories = await resp.json();
    return repositories;
}

function displayRepositories(repositories) {
    repoResults.innerHTML = '';
    repositories.forEach(repository => {
        const repositoryElement = document.createElement('div');
        repoElement.innerHTML = `
            <div>
                <a href="${repository.html_url}" target="_blank">${repo.full_name}</a>
            </div>
        `;
        repositoryResults.appendChild(repositoryElement);
    });
}