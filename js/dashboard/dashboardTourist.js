document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the token from localStorage
        const token = localStorage.getItem('x-auth-token');
        console.log(`x-auth-token: ${token}`);

        // Make the API request
        const response = await fetch('http://localhost:5555/dashboard/tourist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });
        console.log(`response: ${response}`); // Log the response

        // Check and handle response status
        if (response.ok) {
            const data = await response.json();
            // Update the dashboard with tourist data and lists
            const touristData = data.touristData;
            const lists = data.mylists;

            // Update tourist information
            const touristInfo = `
                <h2>${touristData.touristFirstName} ${touristData.touristLastName}</h2>
                <p>Email: ${touristData.touristEmailId}</p>
                <p>Phone: ${touristData.touristPhoneNo}</p>
            `;
            document.querySelector('.tourist-info').innerHTML = touristInfo;

            // Update lists
            const listsContainer = document.getElementById('lists-container');
            listsContainer.innerHTML = lists.map(list => `
                <div class="list-item" data-id="${list._id}">
                    <h3>${list.listTitle}</h3>
                    <p>Status: ${list.liststatus ? 'Open' : 'Closed'}</p>
                    <p>Tourists Registered: ${list.touristsRegistered}</p>
                </div>
            `).join('');

            // Add click event listener to list items
            listsContainer.addEventListener('click', function(event) {
                const listItem = event.target.closest('.list-item');
                if (listItem) {
                    const listId = listItem.getAttribute('data-id');
                    window.location.href = `listtouristdetail.html?id=${listId}`;
                }
            });

        } else {
            // Log response status and body for debugging
            const errorData = await response.json();
            console.error('Error status:', response.status);
            console.error('Error message:', errorData.message);
            
            if (response.status === 401) {
                alert(errorData.message);
                window.location.href = 'login.html';
            } else if (response.status === 500) {
                alert('An error occurred on the server. Please try again later.');
            } else {
                throw new Error('Unexpected status code: ' + response.status);
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred. Please try again later.');
    }

    logoutButton.addEventListener('click', () => {
        // Remove token, userId, and userType from localStorage
        localStorage.removeItem('x-auth-token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');

        // Redirect to home.html
        window.location.href = '../index.html';
    });
});
