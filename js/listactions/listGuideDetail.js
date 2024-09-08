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
        console.log(`x-auth-token: ${token}`); 

        // Make the API request
        const response = await fetch(`http://localhost:5555/list/listdiplayguidedetail/${listId}`, {
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
            const list = data.list;

            // Update page with list details
            const guideData = list.guideData;
            const touristData = list.touristData;

            // Format tourist data for table
            const touristsTableRows = touristData.map(tourist => `
                <tr>
                    <td>${tourist.touristFirstName}</td>
                    <td>${tourist.touristLastName}</td>
                    <td>${tourist.touristEmailId}</td>
                    <td>${tourist.touristPhoneNo}</td>
                    <td>${new Date(tourist.datefrom).toLocaleDateString()}</td>
                    <td>${new Date(tourist.dateto).toLocaleDateString()}</td>
                </tr>
            `).join('');

            document.querySelector('.list-detail').innerHTML = `
                <h2>${list.listTitle}</h2>
                <p><strong>Description:</strong> ${list.listDescription}</p>
                <p><strong>Location:</strong> ${list.location}</p>
                <p><strong>Status:</strong> ${list.liststatus}</p>
                <p><strong>Tourists Registered:</strong> ${list.touristsRegistered}</p>
                <h3>Guide Information</h3>
                <p><strong>Name:</strong> ${guideData.guideFirstName} ${guideData.guideLastName}</p>
                <p><strong>Email:</strong> ${guideData.guideEmailId}</p>
                <p><strong>Phone:</strong> ${guideData.guidePhoneNo}</p>
                <h3>Tourist Details</h3>
                <table id="tourist-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date From</th>
                            <th>Date To</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${touristsTableRows}
                    </tbody>
                </table>
            `;
        } else {
            // Log response status and body for debugging
            const errorData = await response.json();
            console.error('Error status:', response.status);
            console.error('Error message:', errorData.message);
            
            if (response.status === 401) {
                alert(errorData.message);
                window.location.href = 'login.html';
            } else if (response.status === 404) {
                alert(errorData.message);
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
});
