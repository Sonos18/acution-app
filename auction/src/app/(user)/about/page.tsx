import Clock from "../../components/count-down";

export default function About() {
  return (
    <>
      <h1>About</h1>
      <Clock endTime={2000000000000000} />
    </>
  );
}
