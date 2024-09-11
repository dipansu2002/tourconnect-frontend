document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('x-auth-token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    if (!token || !userId || !userType) {
        document.body.innerHTML = '<h1>User is not logged in. Please <a href="../index.html">login</a> to continue.</h1>';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get('id');
    
    if (!listId) {
        alert('No list ID provided.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5555/list/listdiplayguidedetail/${listId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const list = data.list;
            console.log(list);

            const touristsTableRows = list.touristData.map(tourist => `
                <tr>
                    <td>${tourist.touristFirstName}</td>
                    <td>${tourist.touristLastName}</td>
                    <td>${tourist.touristEmailId}</td>
                    <td>${tourist.touristPhoneNo}</td>
                    <td>${new Date(tourist.datefrom).toLocaleDateString()}</td>
                    <td>${new Date(tourist.dateto).toLocaleDateString()}</td>
                </tr>
            `).join('');

            // Check if the list is already closed
            let closeButtonHtml = '';
            if (list.liststatus === true) {
                closeButtonHtml = '<button id="close-list-btn">Close List</button>';
            }

            // Add Delete button (visible regardless of status)
            const deleteButtonHtml = '<button id="delete-list-btn">Delete List</button>';

            document.querySelector('.list-detail').innerHTML = `
                <h2>${list.listTitle}</h2>
                <p><strong>Description:</strong> ${list.listDescription}</p>
                <p><strong>Location:</strong> ${list.location}</p>
                <p><strong>Status:</strong> ${list.liststatus}</p>
                <p><strong>Tourists Registered:</strong> ${list.touristsRegistered}</p>
                <h3>Guide Information</h3>
                <p><strong>Name:</strong> ${list.guideData.guideFirstName} ${list.guideData.guideLastName}</p>
                <p><strong>Email:</strong> ${list.guideData.guideEmailId}</p>
                <p><strong>Phone:</strong> ${list.guideData.guidePhoneNo}</p>
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
                ${closeButtonHtml} <!-- Close button will only show if status is not "Closed" -->
                ${deleteButtonHtml} <!-- Delete button is always visible -->
            `;

            // Add event listener to the "Close List" button if it exists
            if (list.liststatus === true) {
                document.getElementById('close-list-btn').addEventListener('click', async () => {
                    try {
                        const closeResponse = await fetch(`http://localhost:5555/list/liststatusclose/${listId}`, {
                            method: 'POST',
                            headers: {
                                'x-auth-token': token,
                            },
                        });

                        if (closeResponse.ok) {
                            const closeData = await closeResponse.json();
                            alert(closeData.message);
                            // Update the status to "Closed"
                            document.querySelector('.list-detail').innerHTML += `<p><strong>Status:</strong> Closed</p>`;
                        } else {
                            const closeErrorData = await closeResponse.json();
                            alert(closeErrorData.message);
                        }
                    } catch (error) {
                        console.error('Error closing the list:', error);
                        alert('An error occurred while closing the list. Please try again.');
                    }
                });
            }

            // Add event listener to the "Delete List" button (always available)
            document.getElementById('delete-list-btn').addEventListener('click', async () => {
                const confirmDelete = confirm('Are you sure you want to delete this list? This action cannot be undone.');
                if (!confirmDelete) return;

                try {
                    const deleteResponse = await fetch(`http://localhost:5555/list/listdelete/${listId}`, {
                        method: 'POST',
                        headers: {
                            'x-auth-token': token,
                        },
                    });

                    if (deleteResponse.ok) {
                        const deleteData = await deleteResponse.json();
                        alert(deleteData.message);
                        // Redirect to another page after deletion, e.g., dashboard
                        window.location.href = '../pages/dashboardguide.html';
                    } else {
                        const deleteErrorData = await deleteResponse.json();
                        alert(deleteErrorData.message);
                    }
                } catch (error) {
                    console.error('Error deleting the list:', error);
                    alert('An error occurred while deleting the list. Please try again.');
                }
            });

        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error fetching the list details:', error);
        alert('An error occurred. Please try again later.');
    }
});
