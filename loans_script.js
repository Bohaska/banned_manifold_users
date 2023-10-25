async function getUserInfo(username) {
  try {
    const response = await fetch(`https://manifold.markets/api/v0/user/${username}`);
    if (response.ok) {
      const userInfo = await response.json();
      return userInfo;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Failed to fetch user information');
  }
}

async function getUserPositions(userId) {
  try {
    const headers = {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWRyZ2thdHVtbHZmcWF4Y2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5OTUzOTgsImV4cCI6MTk4NDU3MTM5OH0.d_yYtASLzAoIIGdXUBIgRAGLBnNow7JG2SoaNMQ8ySg',
      'Content-Type': 'application/json',
    };

    const json_data = {
      'userId': userId,
      'offset': 0,
      'limit': 5000
    };

    const response = await fetch('https://api-nggbo3neva-uc.a.run.app/get-user-contract-metrics-with-contracts', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(json_data)
    });

    if (response.ok) {
      const positions = await response.json();
      return positions;
    } else {
      throw new Error('Failed to fetch user positions');
    }
  } catch (error) {
    throw new Error('Failed to fetch user positions');
  }
}

async function analyzeOutstandingLoans(username) {
  try {
    const userInfo = await getUserInfo(username);
    const userPositions = await getUserPositions(userInfo.id);

    const loans = [];
    for (const market of userPositions.data.contracts) {
      const metrics = userPositions.data.metricsByContract[market.id];
      if (metrics.from.day.invested > 0) {
        loans.push({
          url: `https://manifold.markets/${market.creatorUsername}/${market.slug}`,
          loans: metrics.loan,
          loan_percentage: metrics.loan / metrics.from.day.invested
        });
      } else if (metrics.payout > 0) {
        loans.push({
          url: `https://manifold.markets/${market.creatorUsername}/${market.slug}`,
          loans: metrics.loan,
          loan_percentage: metrics.loan / metrics.payout
        });
      }
    }

    const sortedLoans = loans.sort((a, b) => b.loans - a.loans);
    return sortedLoans;
  } catch (error) {
    throw new Error('Failed to analyze outstanding loans');
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('username');
  const username = usernameInput.value.trim();

  if (username === '') {
    alert('Please enter a username');
    return;
  }

  try {
    const loans = await analyzeOutstandingLoans(username);
    displayLoans(loans);
  } catch (error) {
    alert(error.message);
  }
}

function displayLoans(loans) {
  const loansList = document.getElementById('loansList');
  loansList.innerHTML = '';

  for (const loan of loans) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <a href="${loan.url}" target="_blank">${loan.url}</a>
      <p>Loans: ${loan.loans}</p>
      <p>Loan Percentage: ${loan.loan_percentage}</p>
    `;
    loansList.appendChild(listItem);
  }
}

const form = document.getElementById('userForm');
form.addEventListener('submit', handleSubmit);
