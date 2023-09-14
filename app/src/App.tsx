import Aside from "./components/aside";
import Banner from "./components/banner";
import Header from "./components/header";

function App() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-6 flex gap-6">
        <Banner />
        <Aside />
      </div>
    </main>
  );
}
export default App;
