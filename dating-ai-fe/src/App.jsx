import "./App.css";
import { User, MessageCircle, X, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";

const fetchRandomProfile = async () => {
  const response = await fetch("http://localhost:8080/profiles/random");
  if (!response.ok) {
    throw new Error("Failed to fetch Profile!");
  }
  return response.json();
};

const saveSwipe = async (profileId) => {
  const response = await fetch("http://localhost:8080/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profileId }),
  });
  if (!response.ok) {
    throw new Error("Failed to save Swipe!");
  }
  return response.json();
};

const fetchMatches = async () => {
  const response = await fetch("http://localhost:8080/matches");
  if (!response.ok) {
    throw new Error("Failed to fetch Matches!");
  }
  return response.json();
};

const fetchConversations = async (conversationId) => {
  console.log("Fetching conversation Id : " + conversationId);
  const response = await fetch(
    "http://localhost:8080/conversations/" + conversationId
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Matches!");
  }
  return response.json();
};

const ProfileSelector = ({ profile, onSwipe }) =>
  profile ? (
    <div className="rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="relative">
        <img src={"http://localhost:8080/images/" + profile.imageUrl} />
        <div className="absolute bottom-0 left-0 right-0 text-white p-4 bg-gradient-to-r from-green-500">
          <h2 className="text-3xl font-bold">
            {profile.firstName} {profile.lastName}, {profile.age}
          </h2>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600">{profile.bio}</p>
      </div>
      <div className="flex p-4 justify-center space-x-4">
        <button
          className="bg-red-500 rounded-full p-4 hover:bg-red-700"
          onClick={() => onSwipe("left", profile.id)}
        >
          <X size={24} />
        </button>
        <button
          className="bg-green-500 rounded-full p-4 hover:bg-green-700"
          onClick={() => onSwipe("right", profile.id)}
        >
          <Heart size={24} />
        </button>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );

const MatchesList = ({ matches, onSelectMatch }) => {
  return (
    <div className="rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Matches</h2>
      <ul>
        {/* {[
        {
          id: 1,
          firstName: "Foo",
          lastName: "Bar",
          imageUrl:
            "http://localhost:8080/images/02e49b90-499c-4d3f-97f2-42c63b81ba79.jpg",
        },
        {
          id: 2,
          firstName: "Foo2",
          lastName: "Bar2",
          imageUrl:
            "http://localhost:8080/images/02e49b90-499c-4d3f-97f2-42c63b81ba79.jpg",
        },
      ].*/}
        {matches.map((match, index) => (
          <li key={index} className="mb-2">
            <button
              className="w-full hover:bg-gray-100 rounded flex item-center"
              onClick={() => onSelectMatch(match.profile, match.conversationId)}
            >
              <img
                src={"http://localhost:8080/images/" + match.profile.imageUrl}
                className="w-16 h-16 rounded-full mr-3 object-cover"
              />
              <span>
                <h3 className="text-xl font-bold">
                  {match.profile.firstName} {match.profile.lastName}
                </h3>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ChatScreen = ({ currentMatch, conversation }) => {
  const [input, setInput] = useState("");
  const handleSend = () => {
    if (input.trim()) {
      console.log(input);
      setInput("");
    }
  };

  return currentMatch ? (
    <>
      <div className="rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold mb-4">
          {" "}
          Chat with {currentMatch.firstName} {currentMatch.lastName}
        </h2>
        <div className="h-[50vh] border rounded overflow-y-auto mb-4 p-2">
          {conversation.map((message, index) => (
            <div key={index}>
              <div className="mb-4 p-2 rounded bg-gray-100">
                {message.messageText}
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border flex-1 rounded p-2 mr-2"
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-500 text-white rounded p-2"
            onClick={() => handleSend()}
          >
            Send
          </button>
        </div>
      </div>
    </>
  ) : (
    <>
      <div>Loading...</div>
    </>
  );
};

function App() {
  const loadRandomProfile = async () => {
    try {
      const profile = await fetchRandomProfile();
      setCurrentProfile(profile);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMatches = async () => {
    try {
      const matches = await fetchMatches();
      setMatches(matches);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRandomProfile();
    loadMatches();
  }, {});

  const [currentScreen, setCurrentScreen] = useState("profile");
  const [currentProfile, setCurrentProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentMatchAndChat, setCurrentMatchAndChat] = useState({
    match: {},
    conversation: [],
  });

  const onSwipe = async (direction, profileId) => {
    loadRandomProfile();
    if (direction === "right") {
      console.log("Liked!");
      await saveSwipe(profileId);
      await loadMatches();
    }
  };

  const onSelectMatch = async (profile, conversationId) => {
    const conversation = await fetchConversations(conversationId);
    setCurrentMatchAndChat({
      match: profile,
      conversation: conversation.messages,
    });
    setCurrentScreen("chat");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "profile":
        return <ProfileSelector profile={currentProfile} onSwipe={onSwipe} />;
      case "matches":
        return <MatchesList matches={matches} onSelectMatch={onSelectMatch} />;
      case "chat":
        console.log(currentMatchAndChat);
        return (
          <ChatScreen
            currentMatch={currentMatchAndChat.match}
            conversation={currentMatchAndChat.conversation}
          />
        );
      default:
        break;
    }
  };
  return (
    <>
      <div className="max-w-md mx-auto">
        <nav className="flex justify-between">
          <User onClick={() => setCurrentScreen("profile")} />
          <MessageCircle onClick={() => setCurrentScreen("matches")} />
        </nav>
        {renderScreen()}
        {/* <ChatScreen /> */}
      </div>
    </>
  );
}

export default App;
