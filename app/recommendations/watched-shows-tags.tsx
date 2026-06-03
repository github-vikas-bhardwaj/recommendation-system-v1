import { WatchedShowTag } from "./watched-show-tag";

type WatchedShowTagsProps = {
  shows: { id: number; name: string }[];
};

export function WatchedShowTags({ shows }: WatchedShowTagsProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {shows.map((show) => (
        <li key={show.id}>
          <WatchedShowTag showId={show.id} name={show.name} />
        </li>
      ))}
    </ul>
  );
}
