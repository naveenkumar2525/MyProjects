import React, { useState } from "react";

const isAnchor=(str:any)=>{
    if (str?.indexOf("href") > -1 && str.indexOf("</a>") > -1){
        return true;
    }else{
        return false;
    }
  }
const HtmlFormatCell = (cell: any) => {
    if(isAnchor(cell)){
     cell = cell.replaceAll('<a','<div class="anchor"><a');
     cell = cell.replaceAll('</a>','</a><span class="tooltips">Open in new tab <svg style="margin-left:5px" width="15px" height="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#373D3F" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></span></div>')
     return (<div  className="main" dangerouslySetInnerHTML={{
        __html: cell.replace(/href/g, "target='_blank' onclick='event.stopPropagation();' class='hyperLinks' href"),
      }}  />
      )}
    else{
      return <div dangerouslySetInnerHTML={{ __html: cell }} />
    }
  }
export default HtmlFormatCell;