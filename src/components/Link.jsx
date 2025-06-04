// Additional link styling (underline, visited color) lives in global.css
export default function Link({ text, href }) {
  return (
    <a className="text-blue-500" href={href}>{ text }</a>
  )
}