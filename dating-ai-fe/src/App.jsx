import "./App.css";
import { User, MessageCircle, X, Heart, Send } from "lucide-react";
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

const sendMessages = async (conversationId, message) => {
  const response = await fetch(
    `http://localhost:8080/conversations/${conversationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authorId: "user", messageText: message }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to submit message!");
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

const ChatScreen = ({ currentMatch, conversation, refreshState }) => {
  const [input, setInput] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(conversation, input);
    }
  };

  const handleSend = async (conversation, input) => {
    if (input.trim()) {
      console.log("11111111");
      console.log(currentMatch, conversation, input);
      await sendMessages(conversation.id, input);
      setInput("");
    }
    refreshState();
  };

  return currentMatch ? (
    <div className="rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-4">
        Chat with {currentMatch.firstName} {currentMatch.lastName}{" "}
      </h2>
      <div className="h-[50vh] border rounded-lg overflow-y-auto mb-6 p-4 bg-gray-50">
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.authorId === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`flex items-end ${
                message.authorId === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {message.authorId === "user" ? (
                <User size={15} />
              ) : (
                <img
                  src={`http://localhost:8080/images/${currentMatch.imageUrl}`}
                  className="w-11 h-11 rounded-full"
                />
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.authorId === "user"
                    ? "bg-blue-500 text-white ml-2"
                    : "bg-gray-200 text-gray-800 mr-2"
                }`}
              >
                {message.messageText}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border-2 border-gray-300 rounded-full py-2 px-4 mr-2 focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-200"
          onClick={() => handleSend(conversation, input)}
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
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
      conversation: conversation,
    });
    setCurrentScreen("chat");
  };

  const refreshChatState = async () => {
    const conversation = await fetchConversations(
      currentMatchAndChat.conversation.id
    );
    setCurrentMatchAndChat({
      match: currentMatchAndChat.match,
      conversation: conversation,
    });
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
            refreshState={refreshChatState}
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
