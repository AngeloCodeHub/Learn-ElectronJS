import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/ui/button';
import { Calendar } from "@/components/ui/calendar"

function App() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className='bg-green-400'>
      <h2>Hello from React!</h2>
      <Button>Click me</Button>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
      />
    </div>
  );
}

const root = createRoot(document.body);
root.render(<App />);
