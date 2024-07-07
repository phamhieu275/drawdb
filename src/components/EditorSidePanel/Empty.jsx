export default function Empty({ title, text }) {
  return (
    <div className="select-none mt-2 text-center">
      <p className="font-bold text-xl">{title}</p>
      <div>{text}</div>
    </div>
  );
}
