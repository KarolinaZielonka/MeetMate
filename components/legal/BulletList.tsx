export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="px-4 list-disc">
      {items.map((item) => (
        <li className="font-light" key={`bullet-list-item-${item.split(" ")[0]}`}>{item}</li>
      ))}
    </ul>
  )
}
