// Cached banned user data
let cachedBannedUsers = [];

// Function to fetch the banned user data
async function fetchBannedUsers(startDate, endDate) {
  const response = await fetch('https://pxidrgkatumlvfqaxcll.supabase.co/rest/v1/users?select=data', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWRyZ2thdHVtbHZmcWF4Y2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5OTUzOTgsImV4cCI6MTk4NDU3MTM5OH0.d_yYtASLzAoIIGdXUBIgRAGLBnNow7JG2SoaNMQ8ySg',
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWRyZ2thdHVtbHZmcWF4Y2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5OTUzOTgsImV4cCI6MTk4NDU3MTM5OH0.d_yYtASLzAoIIGdXUBIgRAGLBnNow7JG2SoaNMQ8ySg'
    }
  });

  const data = await response.json();
  // Cache the fetched data
  cachedBannedUsers = data;
  const bannedUsers = data.filter(user => {
    const createdTime = user.data.createdTime;
    return createdTime > startDate && createdTime < endDate && user.data.isBannedFromPosting;
  });

  return bannedUsers;
}

// Function to display the banned user data on the webpage
async function displayBannedUsers() {
  const startDateElement = document.getElementById('startDate');
  const endDateElement = document.getElementById('endDate');
  const fetchButton = document.getElementById('fetchButton');
  const bannedCountElement = document.getElementById('bannedCount');
  const bannedUserListElement = document.getElementById('bannedUserList');
  const loadingElement = document.getElementById('loading');

  fetchButton.addEventListener('click', async () => {
    const startDate = new Date(startDateElement.value + 'T00:00:00Z').getTime();
    const endDate = new Date(endDateElement.value + 'T00:00:00Z').getTime();

    if (isNaN(startDate) || isNaN(endDate)) {
      alert('Please select valid start and end dates.');
      return;
    }

    loadingElement.style.display = 'block';
    bannedCountElement.textContent = '';
    bannedUserListElement.innerHTML = '';

    let bannedUsers;

    // Check if the data is already cached
    if (cachedBannedUsers.length > 0) {
      bannedUsers = cachedBannedUsers.filter(user => {
        const createdTime = user.data.createdTime;
        return createdTime > startDate && createdTime < endDate && user.data.isBannedFromPosting;
      });
    } else {
      bannedUsers = await fetchBannedUsers(startDate, endDate);
    }

    bannedCountElement.textContent = bannedUsers.length;

    bannedUsers.forEach(user => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `https://manifold.markets/${user.data.username}`;
      link.textContent = user.data.username;
      listItem.appendChild(link);
      bannedUserListElement.appendChild(listItem);
    });

    loadingElement.style.display = 'none';
  });
}

// Call the displayBannedUsers function when the page loads
window.addEventListener('load', displayBannedUsers);
