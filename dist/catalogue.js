export const colours={black:{name:'Washed black',hex:'#292a29'},ivory:{name:'Ivory',hex:'#e6dfce'},burgundy:{name:'Burgundy',hex:'#6e2839'},olive:{name:'Olive',hex:'#61664a'}};
const teeSizes=['XS','S','M','L','XL','XXL'],cargoSizes=['28','30','32','34','36','38'];
export const products=[
{id:'break-the-frame-tee',name:'Break the Frame',type:'Tees',collection:'UNWRITTEN',price:1890,sizes:teeSizes,colours:['black','ivory'],sheet:'tee',row:0,description:'A figure breaking through its borders. Our first graphic, made for an oversized silhouette and an independent point of view.'},
{id:'many-selves-tee',name:'Many Selves',type:'Tees',collection:'UNWRITTEN',price:1890,sizes:teeSizes,colours:['black','ivory'],sheet:'tee',row:1,description:'Layered faces. Different perspectives. An expressive print for every side of you.'},
{id:'own-your-voice-tee',name:'Own Your Voice',type:'Tees',collection:'UNWRITTEN',price:1990,sizes:teeSizes,colours:['black','ivory'],sheet:'tee',row:2,description:'A statement in hand-drawn type. Wear the words, then make them your own.'},
{id:'frame-hoodie',name:'Frame Hoodie',type:'Hoodies',collection:'AFTER HOURS',price:3490,sizes:teeSizes,colours:['black','ivory','burgundy'],sheet:'hoodie',row:0,description:'The original frame artwork, reimagined across the back of a relaxed pullover hoodie. A darker chapter of UNWRITTEN.'},
{id:'voice-hoodie',name:'Voice Hoodie',type:'Hoodies',collection:'AFTER HOURS',price:3490,sizes:teeSizes,colours:['black','ivory','burgundy'],sheet:'hoodie',row:1,description:'Expressive typography takes centre stage on a generous hooded silhouette. Designed to layer with the Utility Cargo.'},
{id:'utility-cargo',name:'Utility Cargo',type:'Cargos',collection:'OFF GRID',price:2990,sizes:cargoSizes,colours:['black','ivory','olive'],sheet:'cargo',row:0,description:'A tapered utility silhouette with statement side pockets. A quieter foundation for bold graphics.'},
{id:'wide-leg-cargo',name:'Wide-Leg Cargo',type:'Cargos',collection:'OFF GRID',price:3190,sizes:cargoSizes,colours:['black','ivory','olive'],sheet:'cargo',row:1,description:'More room. More movement. A wide-leg cargo concept with a strong shape and everyday utility.'}
];
export const money=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
export function imageFor(p,c){return `assets/${p.id}-${c}.webp`;}

// The homepage shares this product's available colours, price and shop link.
// Edit the garment here to update its 3D construction and artwork.
export const featuredGarment={
 productId:'break-the-frame-tee',
 artwork:'assets/unwritten-print.png',
 chestMark:'ARVYRA',
 model:'assets/ghost-tee.glb',
 shape:{depth:1,width:1,height:1},
 lighting:{exposure:1.05},
 rotationSpeed:.55
};

