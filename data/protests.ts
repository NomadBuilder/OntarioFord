/**
 * Manually maintained list of protests and rallies (anti-Ford / provincial accountability).
 * Add new entries to the array — they will appear on the /protests page in card view.
 */
export interface Protest {
  id: string
  title: string
  date: string
  location: string
  description?: string
  link?: string
}

export const protests: Protest[] = [
  // Example entry — duplicate and edit to add real protests:
  // {
  //   id: 'example-1',
  //   title: 'Rally for Public Healthcare',
  //   date: 'March 15, 2025',
  //   location: "Queen's Park, Toronto",
  //   description: 'Join us to demand an end to healthcare privatization and proper funding for public hospitals.',
  //   link: 'https://example.com/event',
  // },
]
