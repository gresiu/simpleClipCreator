const clientId = 'zhbln8a0mbplx6uf5cvrrqxa5jfaan';

const getOAuthToken = async () => {
  if (localStorage.getItem("oauth")) {
    return localStorage.getItem("oauth");
  }
  const parsedHash = new URLSearchParams(window.location.hash.substr(1));
  const accessToken = parsedHash.get('access_token');
  localStorage.setItem("oauth", accessToken);
  console.log(localStorage.getItem("oauth"));

  return accessToken;
};

const getUserId = async (oauthToken, loginName) => {
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${loginName}`, {
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'Client-ID': clientId
      }
    });
    const json = await response.json();
    return json['data'][0]['id'];
  };

const createClip = async (oauthToken, broadcasterId) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${oauthToken}`,
    'Client-ID': clientId
  };
  const response = await fetch('https://api.twitch.tv/helix/clips', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      broadcaster_id: broadcasterId,
      has_delay: 'false',
      started_at: '2023-01-01T00:00:00Z'
    }),
  });
  const json = await response.json();
  console.log(json);
  let message = ((json['data']) ? "Clip has been created and is ready for editing: <a href="+json['data'][0]['edit_url']+">"+json['data'][0]['id']+"</a>" : json['message']);
  document.getElementById("status").innerHTML = "Status: " + message;
  return json['data'][0]['id'];
};

const editClip = async (oauthToken, clipId) => {
  const headers = {
    'Authorization': `Bearer ${oauthToken}`,
    'Client-ID': clientId
  };

  const response = await fetch(`https://api.twitch.tv/helix/clips/${clipId}`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({
      title: 'My Cool Clip',
      description: 'Check out this awesome clip I made!'
    }),
  });
  const json = await response.json();
  console.log(json);
};

const main = async () => {
  const oauthToken = await getOAuthToken();
  const broadcasterId = await getUserId(oauthToken, document.getElementById("nick").value);
  console.log(broadcasterId);
  const clipId = await createClip(oauthToken, broadcasterId);
  console.log(clipId);
  await editClip(oauthToken, clipId);
  
  

};


