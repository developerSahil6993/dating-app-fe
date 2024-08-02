import "./App.css";
import { User, MessageCircle, X, Heart } from "lucide-react";

const ProfileSelector = () => {
  return (
    <>
      <div className="rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="relative">
          <img src="http://localhost:8080/images/02e49b90-499c-4d3f-97f2-42c63b81ba79.jpg" />
          <div className="absolute bottom-0 left-0 right-0 text-white p-4 bg-gradient-to-r from-green-500">
            <h2 className="text-3xl font-bold">Foo bar, 30</h2>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600">Some Bio of User!</p>
        </div>
        <div className="flex p-4 justify-center space-x-4">
          <button
            className="bg-red-500 rounded-full p-4 hover:bg-red-700"
            onClick={() => console.log("Reject!")}
          >
            <X size={24} />
          </button>
          <button
            className="bg-green-500 rounded-full p-4 hover:bg-green-700"
            onClick={() => console.log("%c sucess", "color:green")}
          >
            <Heart size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

const MatchesList = () => (
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
          <button className="w-full hover:bg-gray-100 rounded flex item-center">
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

function App() {
  return (
    <>
      <div className="max-w-md mx-auto">
        <nav className="flex justify-between">
          <User />
          <MessageCircle />
        </nav>
        {/* <ProfileSelector /> */}
        <MatchesList />
      </div>
    </>
  );
}

export default App;
