type Icon = {
  name: string;
  "$schema": string,
  "contributors": string[],
  "tags": string[],
  "categories": string[]
}

type IconCategory = {
  name: string;
  "$schema": string,
  "title": string,
  "icon": string
}

export { Icon, IconCategory }
