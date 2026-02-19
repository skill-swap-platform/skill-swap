import "./index.css";
import AppRouter from "./routes/AppRouter";

// const mockSessions: Session[] = [
//   {
//     id: "1",
//     category: "Spanish Conversation",
//     title: "Basic of Spanish",
//     date: "Saturday, Dec 16",
//     time: "3:00 PM - 4:00 PM",
//     partnerName: "Jane Cooper",
//   },
//   {
//     id: "2",
//     category: "English Speaking",
//     title: "Business English",
//     date: "Monday, Dec 18",
//     time: "6:00 PM - 7:00 PM",
//     partnerName: "Robert Fox",
//   },
// ];
function App() {
  return (
    <>
      <AppRouter />
    </>

  );
}

export default App