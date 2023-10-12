// Function to fetch the banned user data
async function fetchBannedUsers() {
  const response = await fetch('https://pxidrgkatumlvfqaxcll.supabase.co/rest/v1/users?select=data', {
    headers: {
      'apikey': 'YOUR_API_KEY',
      'authorization': 'Bearer YOUR_AUTH_TOKEN'
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
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';

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

  loadingElement.style.display = 'none';
}

// Call the displayBannedUsers function when the page loads
window.addEventListener('load', displayBannedUsers);
