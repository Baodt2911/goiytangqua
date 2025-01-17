import { useState } from "react";
import { Button } from "antd";
function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="card">
        <Button type="primary" onClick={() => setCount((count) => count + 1)}>
          Home
        </Button>
      </div>
      <p className="read-the-docs">{count}</p>
    </>
  );
}

export default Home;
