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
          onClick={() => onSwipe("left")}
        >
          <X size={24} />
        </button>
        <button
          className="bg-green-500 rounded-full p-4 hover:bg-green-700"
          onClick={() => onSwipe("right")}
        >
          <Heart size={24} />
        </button>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );

const MatchesList = ({ onSelectMatch }) => (
  <div className="rounded-lg shadow-lg p-4">
    <h2 className="text-2xl font-bold mb-4">Matches</h2>
    <ul>
      {[
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
      ].map((match) => (
        <li key={match.id} className="mb-2">
          <button
            className="w-full hover:bg-gray-100 rounded flex item-center"
            onClick={onSelectMatch}
          >
            <img
              src={match.imageUrl}
              className="w-16 h-16 rounded-full mr-3 object-cover"
            />
            <span>
              <h3 className="text-xl font-bold">
                {match.firstName} {match.lastName}
              </h3>
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const ChatScreen = () => {
  const [input, setInput] = useState("");
  const handleSend = () => {
    if (input.trim()) {
      console.log(input);
      setInput("");
    }
  };

  return (
    <>
      <div className="rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold mb-4"> Chat with Foo Bar</h2>
        <div className="h-[50vh] border rounded overflow-y-auto mb-4 p-2">
          {[
            "Hi",
            "Hello how r u?",
            "Hello how r u?",
            "Hello how r u?",
            "Hello how r u?",
            "Hello how r u?",
            "Hello how r u?",
            "Hello how r u?",
            "Hello how r u?",
            "Hello how r u?",
            "Hello how r u?",
          ].map((message, index) => (
            <div key={index}>
              <div className="mb-4 p-2 rounded bg-gray-100">{message}</div>
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

  useEffect(() => {
    loadRandomProfile();
  }, {});

  const [currentScreen, setCurrentScreen] = useState("profile");
  const [currentProfile, setCurrentProfile] = useState(null);

  const onSwipe = (direction) => {
    if (direction === "right") {
      console.log("Liked!");
    }
    loadRandomProfile();
  };
  const renderScreen = () => {
    switch (currentScreen) {
      case "profile":
        return <ProfileSelector profile={currentProfile} onSwipe={onSwipe} />;
      case "matches":
        return <MatchesList onSelectMatch={() => setCurrentScreen("chat")} />;
      case "chat":
        return <ChatScreen />;
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
