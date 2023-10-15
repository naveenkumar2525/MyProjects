import React from 'react';
// @ts-ignore
import "./PopoverMenu.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Popover } from "react-bootstrap";

type PopoverProps = {
  menuList: any;
  button: any;
  Cardposition:string
  menuKey:string
  callbackfun:any
  style?: any;
};

const PopoverMenu = (props: PopoverProps) => {
  const { menuList,button,Cardposition, menuKey,callbackfun, style } = props;

  return <div>
      <OverlayTrigger
          trigger="click"
          placement="bottom"
          rootClose
          onToggle={(e)=>{callbackfun(e)}}
          overlay={
              <Popover id={`popover-${menuKey}`}  className={Cardposition+"-positioned "} style={style}>
                  <ul>
                    {menuList.map((item: any) => {
                        return (
                        <>
                            {item.showMenu? 
                                <>
                                    {item.menus} 
                                </>
                            :null}
                        </>
                        );
                    })}
                  </ul>
              </Popover>
          }
      >
          {button}
      </OverlayTrigger>
  </div>
}

export default PopoverMenu;
