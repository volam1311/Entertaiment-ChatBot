import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
function App() {
   const [message, setMessage] = useState();

   useEffect(() => {
      fetch('/api/hello')
         .then((res) => res.json())
         .then((data) => setMessage(data.message));
   }, []);
   return (
      <div>
         <p className="font-bold p-4 text-3xl">{message}</p>
         <Button>Click me !!</Button>
      </div>
   );
}

export default App;
