document.addEventListener('DOMContentLoaded', async () => {
    // Check for localStorage items
    const token = localStorage.getItem('x-auth-token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    if (!token || !userId || !userType) {
        // Show a message if user is not logged in
        document.body.innerHTML = '<h1>User is not logged in. Please <a href="../index.html">login</a> to continue.</h1>';
        return;
    }

    // Function to handle list item click
    window.handleListItemClick = function(listId) {
        if (userType === 'tourist') {
            window.location.href = `listtouristdetail.html?id=${listId}`;
        } else if (userType === 'guide') {
            window.location.href = `listguidedetail.html?id=${listId}`;
        }
    };

    // Function to add a navigation button
    function addNavigationButton() {
        const navContainer = document.getElementById('nav-container');
        if (userType === 'tourist') {
            const button = document.createElement('button');
            button.textContent = 'Dashboard';
            button.onclick = () => window.location.href = 'dashboardtourist.html';
            navContainer.appendChild(button);
        } else if (userType === 'guide') {
            const button = document.createElement('button');
            button.textContent = 'Dashboard';
            button.onclick = () => window.location.href = 'dashboardguide.html';
            navContainer.appendChild(button);
        }
    }

    // Fetch and display lists based on user type
    async function fetchAndDisplayLists(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const lists = data.lists;

                // Display lists
                const listsContainer = document.getElementById('lists-container');
                listsContainer.innerHTML = lists.map(list => `
                    <div class="list-item" onclick="handleListItemClick('${list._id}')">
                        <h3>${list.listTitle}</h3>
                        <p><strong>Location:</strong> ${list.listLocation}</p>
                        <p><strong>Description:</strong> ${list.listDescription}</p>
                        <p><strong>Status:</strong> ${list.liststatus ? 'Active' : 'Closed'}</p>
                        <p><strong>Tourists Registered:</strong> ${list.touristsRegistered}</p>
                        ${userType === 'tourist' ? `<p><strong>Guide:</strong> ${list.guideFirstName} ${list.guideLastName}</p>` : ''}
                    </div>
                `).join('');
            } else {
                const errorData = await response.json();
                console.error('Error status:', response.status);
                console.error('Error message:', errorData.message);

                if (response.status === 401) {
                    document.body.innerHTML = '<h1>Access denied. Please <a href="../index.html">login</a> to continue.</h1>';
                } else if (response.status === 500) {
                    document.body.innerHTML = '<h1>Server error. Please try again later.</h1>';
                } else if (response.status === 404) {
                    document.body.innerHTML = '<h1>No lists found. Please check back later.</h1>';
                } else {
                    document.body.innerHTML = '<h1>An unexpected error occurred.</h1>';
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            document.body.innerHTML = '<h1>An error occurred. Please try again later.</h1>';
        }
    }

    // Add navigation button
    addNavigationButton();

    // Fetch lists based on user type
    if (userType === 'tourist') {
        await fetchAndDisplayLists('http://localhost:5555/list/listdiplaytouristlist');
    } else if (userType === 'guide') {
        await fetchAndDisplayLists('http://localhost:5555/list/listdiplayguidelist');
    } else {
        // Handle unexpected userType
        document.body.innerHTML = '<h1>Invalid user type. Please <a href="../index.html">login</a> again.</h1>';
    }
});
