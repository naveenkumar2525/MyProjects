import React, { useState } from "react";

type Props = {
  items: string[];
  active: string;
  onChange: (item: string) => void;
};

const Tabs = (props: Props) => {
  const { items, active, onChange } = props;
  return (
    <div
      className="flex gap-x-4"
      style={{ borderBottom: "2px solid lightgrey" }}
    >
      {items.map((navItem: string) => (
        <div
          key={navItem}
          className="mt-3 uppercase text-lg font-bold cursor-pointer"
          style={{
            borderBottom: navItem === active ? "2px solid #4A85C2" : "none",
          }}
          onClick={() => {
            onChange(navItem);
          }}
        >
          {navItem}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
