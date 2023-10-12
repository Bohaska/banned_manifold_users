// Function to fetch the banned user data
async function fetchBannedUsers() {
  const response = await fetch('https://pxidrgkatumlvfqaxcll.supabase.co/rest/v1/users?select=data', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWRyZ2thdHVtbHZmcWF4Y2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5OTUzOTgsImV4cCI6MTk4NDU3MTM5OH0.d_yYtASLzAoIIGdXUBIgRAGLBnNow7JG2SoaNMQ8ySg',
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWRyZ2thdHVtbHZmcWF4Y2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5OTUzOTgsImV4cCI6MTk4NDU3MTM5OH0.d_yYtASLzAoIIGdXUBIgRAGLBnNow7JG2SoaNMQ8ySg'
    }
  });

  const data = await response.json();
  const bannedUsers = data.filter(user => {
    const createdTime = user.data.createdTime;
    return createdTime > 1696118400000 && createdTime < 1698796800000 && user.data.isBannedFromPosting;
  });

  return bannedUsers;
}

// Function to display the banned user data on the webpage
async function displayBannedUsers() {
  const bannedUsers = await fetchBannedUsers();

  const bannedCountElement = document.getElementById('bannedCount');
  bannedCountElement.textContent = bannedUsers.length;

  const bannedUserListElement = document.getElementById('bannedUserList');
  bannedUsers.forEach(user => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `https://manifold.markets/${user.data.username}`;
    link.textContent = user.data.username;
    listItem.appendChild(link);
    bannedUserListElement.appendChild(listItem);
  });
}

// Call the displayBannedUsers function when the page loads
window.addEventListener('load', displayBannedUsers);
