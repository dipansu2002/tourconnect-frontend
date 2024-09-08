document.addEventListener('DOMContentLoaded', async () => {
    // Extract the list ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get('id');
    
    if (!listId) {
        alert('No list ID provided.');
        return;
    }

    try {
        // Fetch the token from localStorage
        const token = localStorage.getItem('x-auth-token');

        // Make the API request
        const response = await fetch(`http://localhost:5555/list/listdiplaytouristdetail/${listId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const list = data.list;

            // Update page with list details
            document.querySelector('.list-detail').innerHTML = `
                <h2>${list.listTitle}</h2>
                <p><strong>Description:</strong> ${list.listDescription}</p>
                <p><strong>Location:</strong> ${list.location}</p>
                <p><strong>Status:</strong> ${list.liststatus ? 'Active' : 'Closed'}</p>
                <p><strong>Tourists Registered:</strong> ${list.touristsRegistered}</p>
                <h3>Guide Information</h3>
                <p><strong>Name:</strong> ${list.guideData.guideFirstName} ${list.guideData.guideLastName}</p>
                <p><strong>Email:</strong> ${list.guideData.guideEmailId}</p>
                <p><strong>Phone:</strong> ${list.guideData.guidePhoneNo}</p>
                <p><strong>Experience:</strong> ${list.guideData.guideExperience}</p>
            `;

            // Add event listener to the Register Now button
            document.querySelector('.register-button').addEventListener('click', () => {
                window.location.href = `listregister.html?id=${listId}`;
            });
            
        } else {
            const errorData = await response.json();
            console.error('Error status:', response.status);
            console.error('Error message:', errorData.message);

            // Show appropriate error message based on response status
            if (response.status === 401) {
                alert(errorData.message);
                window.location.href = 'login.html';
            } else if (response.status === 500) {
                alert('An error occurred on the server. Please try again later.');
            } else {
                alert('An unexpected error occurred.');
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred. Please try again later.');
    }
});
