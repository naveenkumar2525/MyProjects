import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type TimelineItemTypeVar = {
  name: string;
  value: unknown;
};

export type TimelineItemType = {
  Icon: IconProp;
  title: string;
  promptText: string;
  uetag: string;
  variables: TimelineItemTypeVar[];
};
