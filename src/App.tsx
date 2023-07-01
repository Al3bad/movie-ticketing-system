import "./App.css";

import PurchaseTickets from "./components/pages/PurchaseTickets/PurchaseTickets";

function App() {
  let docWidth = document.documentElement.offsetWidth;

    [].forEach.call(
      document.querySelectorAll('*'),
      function(el) {
        if (el.offsetWidth > docWidth) {
          console.log(el);
        }
      }
    );
  return (
    <div className="app-container">
      <PurchaseTickets />
    </div>
  );
}

export default App;
