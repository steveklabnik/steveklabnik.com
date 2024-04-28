// for legacy reasons, this is also in global.css. 
export default function Link({ text, href }) {
  return (
    <a className="text-blue-500" href={href}>{ text }</a>
  )
}