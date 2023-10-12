// Store the fetched data
let bannedUsers = [];

// Function to fetch the banned user data
async function fetchBannedUsers() {
  const response = await fetch('https://pxidrgkatumlvfqaxcll.supabase.co/rest/v1/users?select=data', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWRyZ2thdHVtbHZmcWF4Y2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5OTUzOTgsImV4cCI6MTk4NDU3MTM5OH0.d_yYtASLzAoIIGdXUBIgRAGLBnNow7JG2SoaNMQ8ySg',
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWRyZ2thdHVtbHZmcWF4Y2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5OTUzOTgsImV4cCI6MTk4NDU3MTM5OH0.d_yYtASLzAoIIGdXUBIgRAGLBnNow7JG2SoaNMQ8ySg'
    }
  });

  const data = await response.json();
  bannedUsers = data.filter(user => user.data.isBannedFromPosting);
}

// Function to filter and display the banned user data
function filterAndDisplayBannedUsers(startDate, endDate) {
  const filteredUsers = bannedUsers.filter(user => {
    const createdTime = new Date(user.data.createdTime).getTime();
    return createdTime > startDate && createdTime < endDate;
  });

  const bannedCountElement = document.getElementById('bannedCount');
  const bannedUserListElement = document.getElementById('bannedUserList');

  bannedCountElement.textContent = filteredUsers.length;
  bannedUserListElement.innerHTML = '';

  filteredUsers.forEach(user => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `https://manifold.markets/${user.data.username}`;
    link.textContent = user.data.username;
    listItem.appendChild(link);
    bannedUserListElement.appendChild(listItem);
  });
}

// Function to display the banned user data on the webpage
function displayBannedUsers() {
  const startDateElement = document.getElementById('startDate');
  const endDateElement = document.getElementById('endDate');
  const fetchButton = document.getElementById('fetchButton');
  const loadingElement = document.getElementById('loading');

  fetchButton.addEventListener('click', () => {
    const startDate = new Date(startDateElement.value).getTime();
    const endDate = new Date(endDateElement.value).getTime();

    if (isNaN(startDate) || isNaN(endDate)) {
      alert('Please select valid start and end dates.');
      return;
    }

    loadingElement.style.display = 'block';
    filterAndDisplayBannedUsers(startDate, endDate);
    loadingElement.style.display = 'none';
  });
}

// Call the fetchBannedUsers function to fetch the data
fetchBannedUsers().then(() => {
  // Call the displayBannedUsers function when the page loads
  window.addEventListener('load', displayBannedUsers);
});

