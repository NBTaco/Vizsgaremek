import "./title.css";

export default function Title({titlemessage}:any) {
  return (
      <div className="title">
        <h1>{titlemessage}</h1>
      </div>
  );
}