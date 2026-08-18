/** Ikony gadgetů oken jako inline SVG (data URI) – JEDNA tenká 1px linka
 *  pro všechny (designová poznámka uživatele: minimalizace měla dvojitou
 *  linku, sizing gadget 2px a byl vyosený; „airy" = vše stejnou slabou
 *  linkou a ve stejném rastru). Kreslí se jako CSS maska, barvu dává
 *  `background` prvku (stejný vzor jako dřív bitmapy v assets/gadgets/).
 *
 *  Všechny ve viewBoxu 16×16 na půlpixelové mřížce (x.5), aby 1px čára
 *  seděla ostře; tvary podle Amiga Workbench 1.3 gadgetů:
 *  - close: svislý obdélník (zavírací gadget vlevo na liště),
 *  - minimize (zoom): okno s menším oknem v levém horním rohu,
 *  - depth: dva překryté obdélníky (přední zakrývá zadní) – „za ostatní",
 *    stejný pro screen bar i okno,
 *  - resize (sizing): malý čtverec v levém horním rohu spojený s větším
 *    vpravo dole. */

function svg(body) {
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">`
    + `<g fill="none" stroke="#000" stroke-width="1" shape-rendering="crispEdges">${body}</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(doc)}`;
}

export const CLOSE_ICON = svg('<rect x="5.5" y="3.5" width="5" height="9"/>');

export const MINIMIZE_ICON = svg(
  '<rect x="2.5" y="2.5" width="11" height="11"/>'
  + '<rect x="2.5" y="2.5" width="5" height="5"/>',
);

// zadní obdélník má vynechané hrany tam, kde ho zakrývá přední
export const DEPTH_ICON = svg(
  '<path d="M1.5 9.5 V2.5 H10.5 V6.5 M1.5 9.5 H5.5"/>'
  + '<rect x="5.5" y="6.5" width="9" height="7"/>',
);

/** Indikátor fokusu: stylizované oko „<o>" – mandle s kolečkem uvnitř,
 *  jemnou 1px linkou jako gadgety. Výška 12px = svislá proporce glyfů
 *  ostatních gadgetů (jejich obrysy zabírají 11 z 16 jednotek viewBoxu),
 *  aby oko v liště opticky sedělo do stejného rastru. */
export const FOCUS_EYE_ICON = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12" width="16" height="12">'
  + '<g fill="none" stroke="#000" stroke-width="1">'
  + '<path d="M0.5 6 Q8 0.5 15.5 6 Q8 11.5 0.5 6 Z"/>'
  + '<circle cx="8" cy="6" r="2.5"/>'
  + '</g></svg>',
);

export const RESIZE_ICON = svg(
  '<rect x="2.5" y="2.5" width="4" height="4"/>'
  + '<rect x="6.5" y="6.5" width="7" height="7"/>',
);
