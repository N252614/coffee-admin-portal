// Landing page

export default function Home() {
    return (
      <section style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        background: "#8b5a3c",
        color: "white",
        textAlign: "center"
      }}>
        <div>
          <h1 style={{ fontSize: 40 }}>Coffee R Us</h1>
          <p>The go to store for your coffee needs</p>
        </div>
      </section>
    );
  }