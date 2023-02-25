const clientId = 'zhbln8a0mbplx6uf5cvrrqxa5jfaan';

window.onload = async () => {
  const parsedHash = new URLSearchParams(window.location.hash.substr(1));
  if(parsedHash.get('access_token')){
    sessionStorage.setItem("oauth", parsedHash.get('access_token'));
    document.getElementById("clipBody").style.visibility='';
    document.getElementById("loginButton").style.visibility=''""'';
    return;
  }

  if (!sessionStorage.getItem("oauth")) return;

  const response = await fetch(`https://api.twitch.tv/helix/users?login=gresiu`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("oauth")}`,
      'Client-ID': clientId
    }
  });

  if(response["status"] == 401) {
    sessionStorage.removeItem("oauth");
    return;
  }

  document.getElementById("clipBody").style.visibility='';
  document.getElementById("loginButton").style.visibility='';
}

const getOAuthToken = async () => {
  
  if (sessionStorage.getItem("oauth")) {
    return sessionStorage.getItem("oauth");
  }
  const parsedHash = new URLSearchParams(window.location.hash.substr(1));
  const accessToken = parsedHash.get('access_token');
  sessionStorage.setItem("oauth", accessToken);
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
    console.log(response);
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
  //const oauthToken = await getOAuthToken();
  const broadcasterId = await getUserId(sessionStorage.getItem("oauth"), document.getElementById("nick").value);
  console.log(document.getElementById("nick").value + "'s id is " + broadcasterId);
  const clipId = await createClip(sessionStorage.getItem("oauth"), broadcasterId);
  console.log(clipId);
  await editClip(oauthToken, clipId);
  
  

};


