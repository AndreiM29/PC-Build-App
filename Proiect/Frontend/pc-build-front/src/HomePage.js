import React from "react";

const HomePage = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
        <h2 style={{ color: '#333' }}>Build Your Perfect PC Configuration</h2>
        <p style={{ marginBottom: '20px' }}>Start by selecting the components you want for your PC:</p>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          <li style={{ marginBottom: '5px' }}>Processor</li>
          <li style={{ marginBottom: '5px' }}>Graphics Card</li>
          <li style={{ marginBottom: '5px' }}>Memory (RAM)</li>
          <li style={{ marginBottom: '5px' }}>Storage</li>
          <li style={{ marginBottom: '5px' }}>Power Supply</li>
        </ul>
        <p>Customize each component according to your requirements, and we'll help you build a powerful PC.</p>
      </div>


      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            backgroundColor: "#4285F4",
            color: "#fff",
            padding: "20px",
            borderRadius: "50%",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            width: "150px",
            height: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "1",
          }}
        >
          <div>
            <div>(＾◡＾)</div>
            <div>Get Started</div>
            <div>Now!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
